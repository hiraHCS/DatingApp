import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthService } from 'src/app/_Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
 @ViewChild('editForm') editForm:NgForm;
 user:User;
 photoUrl:string;
  @HostListener('window:beforeunload',['$event'])
  
  unloadNotification ($event: any)
  {
    if(this.editForm.dirty)
    {
      $event.returnValue = true;
    }

  }


  constructor(private route:ActivatedRoute ,private userService: UserService , 
    private authService: AuthService,private alertify :AlertifyService) { }

  ngOnInit() {

   this.route.data.subscribe(data=>{
     this.user=data['user'];
   });
   this.authService.currentphotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl);
    
  }
  updatedUser()
  {
    
    this.userService.updateUser(this.authService.decodedToken.nameid,this.user).subscribe
    (next=>{
      console.log(this.user);
      this.alertify.success('Profile Updated Successfully');  
      this.editForm.reset(this.user);
    },error=>{
      this.alertify.error(error);
    })
 
  }
  updateMainPhoto(PhotoUrl)
  {
    this.user.photoUrl=PhotoUrl;
  }
}
