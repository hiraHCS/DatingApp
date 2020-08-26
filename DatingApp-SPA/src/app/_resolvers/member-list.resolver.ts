import {Injectable} from '@angular/core';
import {User } from '../_models/user';
import {UserService} from '../_Services/user.service';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable ,of} from 'rxjs';
import { catchError} from 'rxjs/operators';
@Injectable()
export class MemberlistResolver implements Resolve<User[]>
{
pageNumber = 1;
pageSize = 5;
    constructor(private userService: UserService,
        private router: Router, private alertify: AlertifyService )
    {}
    resolve(route:ActivatedRouteSnapshot):Observable<User[]>{
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error=>{
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        )
    }
}
