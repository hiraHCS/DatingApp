import {Injectable} from '@angular/core';
import {UserService} from '../_Services/user.service';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable ,of} from 'rxjs';
import { catchError} from 'rxjs/operators';

import { AuthService } from '../_Services/auth.service';
import { Messages } from '../_models/messages';
@Injectable()
export class MessagesResolver implements Resolve<Messages[]>
{
pageNumber = 1;
pageSize = 5;
messageContainer='Unread';
    constructor(private userService: UserService,
        private authService: AuthService,private router: Router, private alertify: AlertifyService )
    {}
    resolve(route: ActivatedRouteSnapshot): Observable<Messages[]>{
        return this.userService.getMessages(
            this.authService.decodedToken.nameid,this.pageNumber, this.pageSize,this.messageContainer).pipe(
            catchError(error=>{
                this.alertify.error('Problem retrieving message');
                this.router.navigate(['/home']);
                return of(null);
            })
        )
    }
}
