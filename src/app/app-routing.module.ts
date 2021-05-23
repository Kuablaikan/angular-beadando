import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { WeatherListComponent } from "./weather-list/weather-list.component";
import { WeatherEditComponent } from "./weather-edit/weather-edit.component";

const appRoutes: Routes = [
  { path: 'list', component: WeatherListComponent },
  { path: 'details', component: WeatherEditComponent },
  { path: '**', component: WeatherListComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
