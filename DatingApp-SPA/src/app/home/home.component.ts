import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registermode =false;
  Values:any;
 

  constructor(private http:HttpClient) {

   }

  ngOnInit() {
    this.getValues();
  }
registertoggle(){

  this.registermode=!this.registermode;
}
cancelregistermode(registerMode:boolean)
{
this.registermode = registerMode;
}
getValues()
{
this.http.get('https://localhost:44350/api/Values').subscribe(response => {
this.Values = response;
}, error => {
console.log(error);
});
}




}