import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { Weather } from "../weather";
import { WeatherProviderService } from "../weather-provider.service";

@Component({
  selector: 'app-weather-edit',
  templateUrl: './weather-edit.component.html',
  styleUrls: ['./weather-edit.component.css']
})
export class WeatherEditComponent {

  weatherForm = new FormGroup({
    city: new FormControl('', Validators.required),
    temperature: new FormControl('', Validators.required),
    wind: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  private _weather: Weather = { city: "", temperature: "", wind: "", description: "" };
  private _isValid: boolean = false;

  showErrorMessage: boolean | undefined = undefined;

  constructor(private _weatherProviderService: WeatherProviderService,
              private _router: Router) {
    this._weather = this._weatherProviderService.weather;
    this.weatherForm.valueChanges.subscribe(() => {
      this._weather = this.weatherForm.value;
      this._isValid = this.weatherForm.status !== 'INVALID';
      if (this.showErrorMessage !== undefined)
        this.showErrorMessage = this._isValid ? false : true;
    });
    this.weatherForm.patchValue({
      city: this._weather.city,
      temperature: this._weather.temperature,
      wind: this._weather.wind,
      description: this._weather.description
    });
  }

  saveAndNavigateBack(): void {
    if (this._isValid) {
      this._weatherProviderService.weather = this._weather;
      this._router.navigate(['/list']);
    } else {
      this.showErrorMessage = true;
    }
  }

  cancelAndNavigateBack(): void {
    this._weatherProviderService.index = -1;
    this._weatherProviderService.isNew = false;
    this._router.navigate(['/list']);
  }

}
