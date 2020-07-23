import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { ErrorInterceptor } from '../_Services/error.interceptor';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() valuesfromhome: any;
  @Output() cancelregister = new EventEmitter();

  model: any = {};
  Values: any;
  constructor(private authService: AuthService,private alertify :AlertifyService) {}

  ngOnInit() {}

  register() {
   
    this.authService.register(this.model).subscribe(() => {
      this.alertify.success ('registration successful');
      },
      (error) => {
 this.alertify.error(error);
      }
    );
    console.log(this.model);
  }
  cancel() {
    this.cancelregister.emit(false);
  this.alertify.error('Cancelled');
  }
}
