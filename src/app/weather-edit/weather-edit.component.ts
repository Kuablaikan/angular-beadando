import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { Weather } from "../weather";
import { WeatherProviderService } from "../weather-provider.service";

@Component({
  selector: 'app-weather-edit',
  templateUrl: './weather-edit.component.html',
  styleUrls: ['./weather-edit.component.css']
})
export class WeatherEditComponent {

  weather: Weather = { city: "", temperature: "", wind: "", description: "" };

  constructor(private _weatherProviderService: WeatherProviderService,
              private _router: Router) {
    this.weather = this._weatherProviderService.weather;
  }

  saveAndNavigateBack(): void {
    this._weatherProviderService.weather = this.weather;
    this._router.navigate(['/list']);
  }

  cancelAndNavigateBack(): void {
    this._router.navigate(['/list']);
  }

}
