import { Injectable } from '@angular/core';

import { Weather } from "./weather";

@Injectable({
  providedIn: 'root'
})
export class WeatherProviderService {

  weather: Weather = { city: "", temperature: "", wind: "", description: "" };
  index: number = -1;

  constructor() { }

}
