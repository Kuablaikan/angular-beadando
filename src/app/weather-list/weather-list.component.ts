import { Component, OnInit } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";

import { WeatherService } from "../weather.service";
import { Weather } from "../weather";
import { WeatherDataSource } from "./weather-data-source";

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  styleUrls: ['./weather-list.component.css']
})
export class WeatherListComponent implements OnInit {

  weatherList: WeatherDataSource;
  selection: SelectionModel<Weather>;
  readonly displayedColumns: string[] = ["select", "city", "temperature", "wind", "description"];

  constructor(private weatherService: WeatherService,
              private router: Router) {
    this.weatherList = new WeatherDataSource(this.weatherService);
    this.selection = new SelectionModel<Weather>(true, []);
  }

  ngOnInit(): void { }

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
    this.weatherService.saveWeatherListToStorage(
      this.weatherList.data.filter((weather) => { return !selectedCitiesSet.has(weather.city); })
    );
  }

  rowClicked(row: Weather): void {
    console.log(row);
    this.router.navigate(['/details', { city: row.city}]);
  }

}
