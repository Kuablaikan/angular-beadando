import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { WeatherService } from "../weather.service";

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css']
})
export class WeatherDetailsComponent implements OnInit {

  weatherForm = new FormGroup({
    city: new FormControl(''),
    temperature: new FormControl(''),
    wind: new FormControl(''),
    description: new FormControl('')
  });

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void { }

}
