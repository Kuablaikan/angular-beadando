import { Component } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";

import { WeatherService } from "../weather.service";
import { Weather } from "../weather";
import { WeatherDataSource } from "./weather-data-source";
import { WeatherProviderService } from "../weather-provider.service";

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  styleUrls: ['./weather-list.component.css']
})
export class WeatherListComponent {

  weatherList: WeatherDataSource;
  selection: SelectionModel<Weather>;
  readonly displayedColumns: string[] = ["select", "city", "temperature", "wind", "description"];

  constructor(private _weatherService: WeatherService,
              private _weatherProviderService: WeatherProviderService,
              private _router: Router) {
    this.weatherList = new WeatherDataSource(this._weatherService);
    this.selection = new SelectionModel<Weather>(true, []);
    if (0 <= this._weatherProviderService.index && this._weatherProviderService.index < this.weatherList.data.length) {
      let weatherList: Weather[] = this.weatherList.data;
      weatherList[this._weatherProviderService.index] = this._weatherProviderService.weather;
      this._weatherService.saveWeatherListToStorage(weatherList);
    }
    else if (this._weatherProviderService.isNew) {
      let weatherList: Weather[] = this.weatherList.data;
      weatherList.push(this._weatherProviderService.weather);
      this._weatherService.saveWeatherListToStorage(weatherList);
    }
  }

  isAllRowsSelected() : boolean {
    return this.weatherList.data.length == this.selection.selected.length;
  }

  toggleSelectionOfAllRows() : void {
    if (this.isAllRowsSelected())
      this.selection.clear();
    else
      this.weatherList.data.forEach(row => this.selection.select(row));
  }

  removeSelectedRows(): void {
    let selectedCitiesSet: Set<string> = new Set<string>();
    this.selection.selected.map((weather) => { return weather.city; }).forEach((city) => { selectedCitiesSet.add(city); });
    this._weatherService.saveWeatherListToStorage(
      this.weatherList.data.filter((weather) => { return !selectedCitiesSet.has(weather.city); })
    );
  }

  editRow(row: Weather, index: number): void {
    this._weatherProviderService.weather = row;
    this._weatherProviderService.index = index;
    this._weatherProviderService.isNew = false;
    this._router.navigate(['/details']);
  }

  newRow(): void {
    this._weatherProviderService.weather = { city: "", temperature: "", wind: "", description: "" };
    this._weatherProviderService.index = -1;
    this._weatherProviderService.isNew = true;
    this._router.navigate(['/details']);
  }

}
