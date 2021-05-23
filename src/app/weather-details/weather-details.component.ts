import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { Weather } from "../weather";

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css']
})
export class WeatherDetailsComponent {

  weatherForm = new FormGroup({
    city: new FormControl(''),
    temperature: new FormControl(''),
    wind: new FormControl(''),
    description: new FormControl('')
  });

  private _weather: Weather = { city: "", temperature: "", wind: "", description: "" };

  @Input()
  set weather(weather: Weather) {
    this._weather = weather;
    this.weatherForm.patchValue({
      city: weather.city,
      temperature: weather.temperature,
      wind: weather.wind,
      description: weather.description
    });
  }

  get weather(): Weather {
    return this._weather;
  }

  @Output() weatherChange = new EventEmitter<Weather>();

  constructor() {
    this.weatherForm.valueChanges.subscribe(() => {
        this._weather = this.weatherForm.value;
        this.weatherChange.emit(this._weather);
      });
  }

}
