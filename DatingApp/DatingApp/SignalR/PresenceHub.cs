using DatingApp.Data;
using DatingApp.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
namespace DatingApp.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        //private readonly IDatingRepository _datingRepository;
  
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
             
        }
        
        public override async Task OnConnectedAsync()
        {
          
            await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOnline",Context.User.GetUsername());
            var CurrentUsers = await _tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers",CurrentUsers);

        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
       
            await _tracker.UserDisConnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
            var CurrentUsers = await _tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", CurrentUsers);
            await base.OnDisconnectedAsync(exception);
        }


    }
}
