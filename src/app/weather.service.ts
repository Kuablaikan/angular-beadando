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

  private static readonly storageKey: string = "weatherList";

  private storedWeatherSubject: BehaviorSubject<Weather[]> = new BehaviorSubject<Weather[]>([]);

  constructor(private httpClient: HttpClient) {
    this.getWeatherOfCitiesFromAPI(initialCities).subscribe(
      (weatherList) => { this.saveWeatherListToStorage(weatherList); }
    );
  }

  getWeatherOfCityFromAPI(city: string): Observable<NullableWeather> {
    return this.httpClient.get<Weather>(`api/${city}`).pipe(
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
              chainedAPICall(cities).subscribe((weatherList: Weather[]) => {
                if (weather)
                  weatherList.push(weather);
                observer.next(weatherList);
                observer.complete();
              });
            },
            () => {
              chainedAPICall(cities).subscribe((weatherList: Weather[]) => {
                observer.next(weatherList);
                observer.complete();
              });
            });
        });
      }
    }
    return chainedAPICall(auxCities);
  }

  loadWeatherListFromStorage(): Weather[] {
    const item = localStorage.getItem(WeatherService.storageKey);
    let weatherList: Weather[] = [];
    if (item) {
      weatherList = JSON.parse(item) as Weather[];
    }
    return weatherList;
  }

  saveWeatherListToStorage(weatherList: Weather[]): void {
    localStorage.setItem(WeatherService.storageKey, JSON.stringify(weatherList));
    this.storedWeatherSubject.next(weatherList);
  }

  getWeatherListObservable(): Observable<Weather[]> {
    return this.storedWeatherSubject.asObservable();
  }

}
