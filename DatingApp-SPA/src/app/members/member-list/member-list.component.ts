import { Component, OnInit } from '@angular/core';
import {UserService} from '../../_Services/user.service';
import {User} from '../../_models/user';
import { AlertifyService } from '../../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/Pagination';


@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
users: User[];
pagination:Pagination;
  constructor(private userService:UserService, private alertify:AlertifyService,
    
    private route:ActivatedRoute) { }

  ngOnInit() {
   // this.loaduser();
   this.route.data.subscribe(data=>
    {
       this.users=data['users'].result;
     
    });
  }
//loaduser()
//{this.userService.
//getUsers().subscribe((users: User[] ) =>
//{this.users=users;}, error =>{ this.alertify.error(error);})}

}
