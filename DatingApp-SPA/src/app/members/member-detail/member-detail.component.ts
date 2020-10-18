import { Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { PresenceService } from 'src/app/_Services/presence.service';
import { Messages } from 'src/app/_models/messages';
import { AuthService } from 'src/app/_Services/auth.service';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit,OnDestroy {
  @ViewChild ('memberTabs',{ static: true})memberTabs: TabsetComponent
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messages: Messages[] = [];
  activeTab:TabDirective;

  constructor(
    public presence:PresenceService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router:Router
  ) {


    this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
  }


  ngOnInit() {
   
    this.route.data.subscribe(data => {
      const usr = 'user';
      this.user = data[usr];
    });

    this.route.queryParams.subscribe(params=>
    {
     const selectedTab = params['tab'];
    
 this.memberTabs.tabs [selectedTab >0?selectedTab: 0].active=true;});
    this.galleryOptions=[
      {
      width:'500px',
      height:'500px',
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview:false
        
      }
    ]
    this.galleryImages = this.getImages();


  }

  getImages()
  {
const imageUrls=[];
for (const photo of this.user.photos) {
  imageUrls.push({
    small:photo.url,
    medium:photo.url,
    big:photo.url,
    description:photo.description
  })
  
}
return imageUrls;
  }
 
  onTabActivated(data:TabDirective)
  {
    this.activeTab=data;
    if(this.activeTab.heading==='Messages'&&this.messages.length===0)
    {
    this.userService.createHubConnection(this.user.id)
    }
    else
    {
       this.userService.stopHubConnection();
    }
  }
  ngOnDestroy(): void {
    this.userService.stopHubConnection();
  }
  selectTab(tabId:number)
  {
    this.memberTabs.tabs[tabId].active=true;
  }
 

 
}
