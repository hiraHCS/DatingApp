
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Messages } from 'src/app/_models/messages';
import { User } from 'src/app/_models/user';
import { MessagesResolver } from 'src/app/_resolvers/messages.resolver';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { AuthService } from 'src/app/_Services/auth.service';
import { UserService } from 'src/app/_Services/user.service';
import {tap} from '../../../../node_modules/rxjs/operators';
@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm:NgForm;
   @Input() messages:Messages[];
   @Input() userid:number;

messageContent:string;
  constructor(public userService:UserService,private authService:AuthService) { 

      
    }

  ngOnInit() {

 
  }
 

 sendMessage()
 {

   this.userService.SendMessage(this.userid,this.messageContent, 
    parseInt(this.authService.decodedToken.nameid)).then(()=>
   {
     this.messageForm.reset();
   })
   
 }

   }
