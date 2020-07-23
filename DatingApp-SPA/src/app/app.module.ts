import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { AppComponent } from './app.component';
import {ErrorInterceptorProvider} from './_Services/error.interceptor';
import { NavComponent } from './nav/nav.component';
import {FormsModule} from '@angular/forms';
import {AuthService} from './_Services/auth.service';
import {MemberListComponent} from './members/member-list/member-list.component';
import {MemberCardComponent} from './members/member-card/member-card.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import {MemberDetailComponent} from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { AlertifyService } from './_Services/alertify.service';
import { AuthGuard } from './_guards/auth.guard';
import { UserService } from './_Services/user.service';
import{MemmberDetailResolver} from './_resolvers/member-detail.resolver';



export function tokenGetter()
{
   return localStorage.getItem('token');
}
@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
  MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
     
   ],
   imports: [
  
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      JwtModule.forRoot({config:{
         tokenGetter : tokenGetter,
         allowedDomains:['localhost:44350'],
         disallowedRoutes:['localhost:44350/api/auth']

         
      }
   })
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      UserService,
      MemmberDetailResolver
      

   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
