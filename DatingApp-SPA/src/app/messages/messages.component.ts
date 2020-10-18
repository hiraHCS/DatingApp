import { Messages } from '../_models/messages';
import { Component, OnInit } from '@angular/core';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { UserService } from '../_Services/user.service';
import { AuthService } from '../_Services/auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
messages: Messages[];

pagination: Pagination;
messageContainer:'Unread';
  constructor(private userService:UserService,private authService:AuthService
    ,private route:ActivatedRoute,private alertify:AlertifyService) { }
  ngOnInit() {
      this.route.data.subscribe(data => { 
      this.messages =    data['messages'].result;
      this.pagination =  data['messages'].pagination;

    })
  }
  loadMessages(){
    this.userService.
    getMessages(
   this.authService.decodedToken.nameid
      , this.pagination.currentPage
      , this.pagination.itemsPerPage
      , this.messageContainer).
      subscribe((res: PaginationResult<Messages[]>)=>
      {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, 
    error => { this.alertify.error(error); } 
      )
    }
  
pageChanged(event:any):void{
  this.pagination.currentPage=event.page;
  this.loadMessages();
}
deleteMessage(id:number)
{
  this.alertify.confirm('Are you sure you want to delet this message',()=>
  {
    this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(()=>
    {
      this.messages.splice(this.messages.findIndex(m=>m.id==id),1);
      this.alertify.success('Message has been deleted')
    },error=>
    {
      this.alertify.error('failed to delete the message');
    });
  });
}

}
