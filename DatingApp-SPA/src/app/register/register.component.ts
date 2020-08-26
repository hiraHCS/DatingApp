import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { ErrorInterceptor } from '../_Services/error.interceptor';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() valuesfromhome: any;
  @Output() cancelregister = new EventEmitter();

  model: any = {};
  registerForm : FormGroup;
  user:User;
  bsConfig: Partial <BsDatepickerConfig>;
 // Values: any;
  constructor(private authService: AuthService,
private router :Router,private alertify :AlertifyService, private fb: FormBuilder) {}

  ngOnInit() {
//this.registerForm=new FormGroup({
//username:new FormControl('', Validators.required ),
//password:new FormControl('',[Validators.required,Validators.minLength(4),
  //Validators.maxLength(8)]),
//confirmPassword: new FormControl('',Validators.required)

//}, this.passwordMatchValidator);
this.bsConfig = {
  containerClass: 'theme-red'
},
this.CreateRegisterForm();

}
CreateRegisterForm()
{
  this.registerForm = this.fb.group({
    gender: ['male'],
    username: [ '', Validators.required],
    knownAs: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    password: [ '', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    confirmPassword: ['', Validators.required]
    },
    {
      validators: this.passwordMatchValidator
    } );
}
passwordMatchValidator(g:FormGroup)
{
return g.get('password').value===g.get('confirmPassword').value ? null : { 'mismatch' : true};

}

  register() {
    if(this.registerForm.valid)
    {
this.user=Object.assign({},this.registerForm.value);
this.authService.register(this.user).subscribe(() =>
{
  this.alertify.success('Registration successfull')
}, error =>
{
this.alertify.error('error');
},
()=> {
  this.authService.login(this.user).subscribe(()=>
  {
    this.router.navigate(['/members']);
  });
});
}
    //this.authService.register(this.model).subscribe(() => {
      //this.alertify.success ('registration successful');
     // },
      //(error) => {
 //this.alertify.error(error);
   //   }
    //);
    //console.log(this.model);

console.log(this.registerForm.value);

  }
  cancel() {
    this.cancelregister.emit(false);
  this.alertify.error('Cancelled');
  }
}
