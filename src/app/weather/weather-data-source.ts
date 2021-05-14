import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";

import { Weather } from "../weather";
import { WeatherService } from "../weather.service";

export class WeatherDataSource implements DataSource<Weather> {

  data: Weather[] = [];

  constructor(private weatherService: WeatherService) {
    this.weatherService.getWeatherListObservable().subscribe(
      (weatherList) => {
        this.data = weatherList;
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<Weather[]> {
    return this.weatherService.getWeatherListObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void { }

}
