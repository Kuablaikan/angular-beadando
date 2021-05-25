import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { WeatherListComponent } from "./weather-list/weather-list.component";
import { WeatherEditComponent } from "./weather-edit/weather-edit.component";
import { LoginGuard } from "./login.guard";
import { LoginComponent } from "./login/login.component";

const appRoutes: Routes = [
  { path: 'list', component: WeatherListComponent, canActivate: [LoginGuard] },
  { path: 'details', component: WeatherEditComponent, canActivate: [LoginGuard] },
  { path: '**', component: LoginComponent }
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
