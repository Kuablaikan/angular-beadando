import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { Weather } from './weather';
import { initialCities } from "./initial-cities";

type NullableWeather = Weather | null;

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private static readonly _storageKey: string = "weatherList";
  private static readonly _expiryTime: number = 15 * 60 * 1000;
  private static readonly _waitTimeBetweenChainedCalls = 250;

  private _storedWeatherSubject: BehaviorSubject<Weather[]> = new BehaviorSubject<Weather[]>([]);

  constructor(private _httpClient: HttpClient) {
    const weatherList = this.loadWeatherListFromStorage();
    if (weatherList.length == 0) {
      this.getWeatherOfCitiesFromAPI(initialCities).subscribe(
        (weatherList) => {
          this.saveWeatherListToStorage(weatherList);
        }
      );
    } else {
      this._storedWeatherSubject.next(weatherList);
    }
  }

  getWeatherOfCityFromAPI(city: string): Observable<NullableWeather> {
    return this._httpClient.get<Weather>(`api/${city}`).pipe(
      catchError(() => {
        return of(null);
      }),
      map((weather) => {
        if (weather)
          weather.city = city;
        return weather;
      })
    );
  }

  getWeatherOfCitiesFromAPI(cities: string[]): Observable<Weather[]> {
    let auxCities: string[] = Object.assign([], cities);
    const chainedAPICall = (cities: string[]): Observable<Weather[]> => {
      if (cities.length == 0) {
        return new Observable<Weather[]>((observer) => {
          observer.next([]);
          observer.complete();
        });
      } else {
        const city: string = cities.pop() as string;
        return new Observable<Weather[]>((observer) => {
          this.getWeatherOfCityFromAPI(city).subscribe(
            (weather: NullableWeather) => {
              setTimeout(() => {
                chainedAPICall(cities).subscribe((weatherList: Weather[]) => {
                  if (weather)
                    weatherList.push(weather);
                  observer.next(weatherList);
                  observer.complete();
                });
              }, WeatherService._waitTimeBetweenChainedCalls);
            },
            () => {
              setTimeout(() => {
                chainedAPICall(cities).subscribe((weatherList: Weather[]) => {
                  observer.next(weatherList);
                  observer.complete();
                });
              }, WeatherService._waitTimeBetweenChainedCalls);
            });
        });
      }
    }
    return chainedAPICall(auxCities);
  }

  loadWeatherListFromStorage(): Weather[] {
    const item = localStorage.getItem(WeatherService._storageKey);
    let weatherList: Weather[] = [];
    if (item) {
      const parsed = JSON.parse(item);
      if (Date.now() <= parsed.expiry)
        weatherList = parsed.data as Weather[];
    }
    return weatherList;
  }

  saveWeatherListToStorage(weatherList: Weather[], expiry: number = Date.now() + WeatherService._expiryTime): void {
    localStorage.setItem(WeatherService._storageKey, JSON.stringify({ expiry: expiry, data: weatherList }));
    this._storedWeatherSubject.next(weatherList);
  }

  getWeatherListObservable(): Observable<Weather[]> {
    return this._storedWeatherSubject.asObservable();
  }

}
