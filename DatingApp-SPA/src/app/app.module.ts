import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';
import { ButtonsModule } from 'ngx-bootstrap/buttons';


import { AppComponent } from './app.component';
import {ErrorInterceptorProvider} from './_Services/error.interceptor';
import { NavComponent } from './nav/nav.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './_Services/auth.service';
import {MemberListComponent} from './members/member-list/member-list.component';
import {MemberCardComponent} from './members/member-card/member-card.component';
import {MemberEditComponent} from './members/member-edit/member-edit.component';
import {PhotoEditorComponent} from './members/photo-editor/photo-editor.component';
import {MemberMessagesComponent} from './members/member-messages/member-messages.component';

import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import {MemberDetailComponent} from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { AlertifyService } from './_Services/alertify.service';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { UserService } from './_Services/user.service';
import{MemberDetailResolver} from './_resolvers/member-detail.resolver';
import {MemberEditResolver}  from  './_resolvers/member-edit.resolver';
import {MemberlistResolver} from  './_resolvers/member-list.resolver';
import {ListsResolver} from  './_resolvers/lists.resolver';
import {MessagesResolver} from  './_resolvers/messages.resolver';
import { ToastrModule } from 'ngx-toastr';
import {PresenceService} from './_Services/presence.service';
import { CommonModule } from '@angular/common';

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
      MemberEditComponent,
      PhotoEditorComponent,
      MessagesComponent,
      MemberMessagesComponent
    
     
     
   ],
   imports: [
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      NgxGalleryModule,
      FileUploadModule,
      PaginationModule.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      ButtonsModule.forRoot(),
      TimeagoModule.forRoot(),
      TabsModule.forRoot(),
      ToastrModule.forRoot({
         positionClass:'toast-bottom-right'
      }), // ToastrModule added
      RouterModule.forRoot(appRoutes),
            JwtModule.forRoot({config: {
         tokenGetter : tokenGetter,
         allowedDomains:['localhost:44350'],
         disallowedRoutes:['localhost:44350/api/auth']

         
      }
   })
   ],
   providers: [
      ListsResolver,
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      PreventUnsavedChanges,
      UserService,
      PresenceService,
      MemberDetailResolver,
      MemberEditResolver,
      MemberlistResolver,
      MessagesResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
