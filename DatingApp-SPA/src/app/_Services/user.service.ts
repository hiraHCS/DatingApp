import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginationResult } from '../_models/Pagination';
import { map, take } from 'rxjs/operators';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Messages } from '../_models/messages';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;
  hubUrl=environment.hubUrl;
token :string;

private hubConnection:HubConnection;
private messageThreadSource= new BehaviorSubject<Messages[]>([]);


messageThread$=this.messageThreadSource.asObservable();

  constructor(private http: HttpClient,private authService:AuthService) {}

  createHubConnection(otherUsername: number)
{
  debugger
this.token= localStorage.getItem('token');

  this.hubConnection= new HubConnectionBuilder()
  .withUrl(this.hubUrl+'message?user='+ otherUsername,
  {
    accessTokenFactory:()=> this.token
  })
.withAutomaticReconnect()
.build()
this.hubConnection.start().catch(error=>console.log(error))

this.hubConnection.on('RecieveMessageThread',messages=>
{

  this.messageThreadSource.next(messages);
})

this.hubConnection.on('NewMessage',message=>
{
  this.messageThread$.pipe(take(1)).subscribe(messages=>{
    this.messageThreadSource.next([...messages,message])
  })

})

this.hubConnection.on('UpdateGroup',(group:Group)=>
{
 if(group.connections.some(x=>x.username===otherUsername))
 {
   this.messageThread$.pipe(take(1)).subscribe(messages=>{
     messages.forEach(message=>{
       if(!message.dateRead)
       {
         message.dateRead= new Date(Date.now())
       }
     })
     this.messageThreadSource.next([...messages]);
   })
 
 }
})


}  







stopHubConnection()
{
  if(this.hubConnection)
  {
    this.hubConnection.stop();
  }
 
}












  getUsers(page?, itemPerPage?,userParams?, likesParam?): Observable<PaginationResult<User[]>> {
    const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();
  
    let params = new HttpParams();

    if (page != null && itemPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }
if(userParams!=null)
{
  params=params.append('minAge',userParams.minAge);
  params=params.append('maxAge',userParams.maxAge);
  params=params.append('gender',userParams.gender);
  params=params.append('orderBy',userParams.orderBy);
}

if(likesParam==='Likers')
{
  params = params.append('likers','true');
}
if(likesParam==='Likees')
{
  params = params.append('likees','true');
}

return this.http
      .get<User[]>(this.baseUrl + 'users', { observe: 'response', responseType: 'json', params })
      .pipe(
        map((response) => {
       
          paginationResult.result = response.body;
        
          if (response.headers.get('pagination') != null) {
            paginationResult.pagination = JSON.parse(response.headers.get('pagination'));
          }
          
          return paginationResult;
        })
      );
  }
  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }
  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain/',
      {}
    );
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }
  sendLike(id:number,recipientId:number)
  {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }
  getMessages(
    id:number
    ,page?
    ,itemPerPage?
    , messageContainer?
    )
  {
    const paginationResults:PaginationResult<Messages[]>=new PaginationResult<Messages[]>();
    let params=new HttpParams();
    params=params.append('MessageContainer',messageContainer);

    if (page != null && itemPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }
    return this.http.get<Messages[]>(this.baseUrl+'users/'+ id +'/messages',{observe:'response', params})
    .pipe(
      map((response) => {    
        paginationResults.result = response.body;   
        if (response.headers.get('pagination') != null) {
          paginationResults.pagination = JSON.parse(response.headers.get('pagination'));
        }
        
        return paginationResults;
      })
    );
  }
getMessageThread(id:number ,recipientId:number)
{
  return this.http.get<Messages[]>(this.baseUrl+'users/'+id+'/messages/thread/'+recipientId)
}
async SendMessage(id:number,content:string, sender:number)
{
  debugger
  

  const params={
    recipientId:id
    ,content:content
    ,senderId:sender
  }
  
  return  this.hubConnection?.invoke('SendMessage',params)
  .catch(error=>console.log(error))
}
deleteMessage(id:number,userId:number)
{
  return this.http.post(this.baseUrl+'users/'+userId+'/messages/'+id,{})
}
markRead(userId:number,messageId:number)
{
  this.http.post(this.baseUrl+'users/' +userId+'/messages/'+messageId+'/read',{} )
  .subscribe();
}

}
