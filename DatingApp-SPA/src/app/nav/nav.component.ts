import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { error } from '@angular/compiler/src/util';

import { from } from 'rxjs';
import { AlertifyService } from '../_Services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  // tslint:disable-next-line: typedef
  ngOnInit() {
    // tslint:disable-next-line: no-debugger
  }
  // tslint:disable-next-line: typedef
  Login() {

    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertify.success('Logged in successfully');

      },

      (error) => {
        debugger;
        this.alertify.error(error);
        console.log(error);
      },
      ()=>this.router.navigate(['/members']));
  }


  LoggedIn() {
    //const token =localStorage.getItem('token');
    //return !!token;
    return this.authService.loggedIn();
  }
  loggedout() {
    localStorage.removeItem('token');
    this.alertify.message('Logged out');
    this.router.navigate(['home']);
  }
}
