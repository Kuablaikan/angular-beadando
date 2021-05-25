import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";

import { Weather } from "../weather";
import { WeatherProviderService } from "../weather-provider.service";

@Component({
  selector: 'app-weather-edit',
  templateUrl: './weather-edit.component.html',
  styleUrls: ['./weather-edit.component.css']
})
export class WeatherEditComponent {

  weatherForm = new FormGroup({
    city: new FormControl(''),
    temperature: new FormControl(''),
    wind: new FormControl(''),
    description: new FormControl('')
  });

  private _weather: Weather = { city: "", temperature: "", wind: "", description: "" };

  constructor(private _weatherProviderService: WeatherProviderService,
              private _router: Router) {
    this._weather = this._weatherProviderService.weather;
    this.weatherForm.patchValue({
      city: this._weather.city,
      temperature: this._weather.temperature,
      wind: this._weather.wind,
      description: this._weather.description
    });
    this.weatherForm.valueChanges.subscribe(() => {
      this._weather = this.weatherForm.value;
    });
  }

  saveAndNavigateBack(): void {
    this._weatherProviderService.weather = this._weather;
    this._router.navigate(['/list']);
  }

  cancelAndNavigateBack(): void {
    this._weatherProviderService.index = -1;
    this._weatherProviderService.isNew = false;
    this._router.navigate(['/list']);
  }

}
