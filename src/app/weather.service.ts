import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Weather } from './weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private static readonly storageKey: string = "weatherList";

  constructor(private httpClient: HttpClient) { }

  getWeatherOfCityFromAPI(city: string): Observable<Weather> {
    return this.httpClient.get<Weather>(`api/${city}`).pipe(map((weather) => {
      weather.city = city;
      return weather;
    }));
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
          this.getWeatherOfCityFromAPI(city).subscribe((weather: Weather) => {
            chainedAPICall(cities).subscribe((weatherList: Weather[]) => {
              weatherList.push(weather);
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
  }

}
