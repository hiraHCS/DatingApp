import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import {BehaviorSubject} from 'rxjs';
import { PresenceService } from './presence.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
baseUrl = environment.apiUrl+'Auth/';
jwtHelper =new JwtHelperService();
decodedToken: any ; 
currentuser:User;

photoUrl=new BehaviorSubject<string>('../assets/user.jpg');

currentphotoUrl=this.photoUrl.asObservable();

constructor(private http: HttpClient,private presence:PresenceService ) { }

changeMemberPhoto (photoUrl: string)
{
  this.photoUrl.next(photoUrl);
}

login (model: any )
{
return this.http.post(this.baseUrl + 'Login', model)
.pipe(
  map((response: any)=>
  { const user =response;
    if(user)
    {
      localStorage.setItem('token',user.token);
      localStorage.setItem('user',JSON.stringify(user.user));
      this.decodedToken = this.jwtHelper.decodeToken(user.token);
      this.currentuser = user.user;
      // console.log(this.decodedToken);
      this.changeMemberPhoto(this.currentuser.photoUrl);

     
      this.presence.createHubConnection(user.user);

    }
   
  })
)

}
register (user: User)
{
  return this.http.post(this.baseUrl + 'register', user)
  .pipe
  (
  map((user:User)=>
  {
  this.currentuser=user;
  this.presence.createHubConnection(user);
  })
  )
}
loggedIn()
{

  const token =localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
  

}
loggedOut()
{
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.decodedToken = null;
  this.currentuser = null;
  this.presence.stopHubConnection();
}

}
