import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { LoginGuard } from "../login.guard";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  showErrorMessage: boolean | undefined = undefined;

  constructor(private _loginGuard: LoginGuard,
              private _router: Router) { }

  tryToLogin(): void {
    this._loginGuard.isLoggedIn = this.loginForm.value.username == "admin" && this.loginForm.value.password == "admin";
    this.showErrorMessage = !this._loginGuard.isLoggedIn;
    if (this._loginGuard.isLoggedIn)
      this._router.navigate(['/list']);
  }

}
