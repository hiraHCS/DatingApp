using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.SignalR
{
    public class MessageHub:Hub
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _presenceTracker;
        private readonly DataContext _context;
        public MessageHub(IDatingRepository datingRepository,IMapper mapper
            ,IHubContext<PresenceHub>presenceHub,PresenceTracker tracker, DataContext context)
        {
            _presenceHub = presenceHub;
            _presenceTracker = tracker;
            _mapper = mapper;
            _datingRepository = datingRepository;
            _context = context;
        }
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            int OtherUser = int.Parse(httpContext.Request.Query["user"].ToString());
            string otherusername = await _datingRepository.GetUsername(OtherUser);
            var groupName = GetGroupName(Context.User.GetUsername(), otherusername);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

       var group=     await AddToGroup( groupName);
            string[] username = group.Name.Split('-');
            int userid1 = await _datingRepository.GetUserid(username[0].ToString());
            int userid2 = await _datingRepository.GetUserid(username[1].ToString());
            List<Message> message = new List<Message>();
            message = _context.Messages.Where(x => x.Id == userid1 || x.Id == userid2).ToList();
         
            foreach (var item in message)
            {
                var chat = await _datingRepository.GetMessage(item.Id);
                chat.DateRead = DateTime.UtcNow;
                chat.IsRead = true;

                await _datingRepository.SaveAll();
            }
           
       
            await Clients.Group(groupName).SendAsync("UpdateGroup", group);
            var messages = await _datingRepository.
                GetMessageThread(Context.User.GetUserid(), OtherUser);
            var messageThread = _mapper.Map<IEnumerable<MesssageToReturnDto>>(messages);

          


            await Clients.Caller.SendAsync("RecieveMessageThread", messageThread);

        }
        public override async Task  OnDisconnectedAsync(Exception exception)
        {
            var group= await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdateGroup", group);

            await base.OnDisconnectedAsync(exception);
        }
        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _datingRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername()
                );
            if(group==null)
            {
                group = new Group(groupName);
                _datingRepository.AddGroup(group);
            }
            group.Connections.Add(connection);
            if( await _datingRepository.SaveAll())
            {
                
                return group;
            }
            else
            {
                throw new HubException("Failed to join group");
            }
                
           
        }
        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _datingRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.
                FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _datingRepository.RemoveConnection(connection);
            if (await _datingRepository.SaveAll())
            {
                return group;
            }
            else
            {
                throw new HubException("failed to remove from group");
            }
        }
       
        public async Task SendMessage (MessageForCreationDto messageForCreationDto)
        {
            var username = Context.User.GetUsername();
            if (Context.User.GetUserid() != messageForCreationDto.SenderId)
            {
                throw new HubException("You cannot send message to yourself");
            }

            var sender = await _datingRepository.GetUser(Context.User.GetUserid());
            var recipent = await _datingRepository.GetUser(messageForCreationDto.RecipientId);
            if (recipent == null)
            {
                throw new HubException("Not Found User");
            }
            var message = new Message
            {
                Sender = sender,
                Recipient = recipent,
                SenderId = sender.Id,
                RecipientId = recipent.Id,
                Content = messageForCreationDto.Content,
                MessageSent = DateTime.UtcNow
            };
            var groupName = GetGroupName(sender.Username, recipent.Username);
            var group = await _datingRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.Username == recipent.Username))
            {
                message.DateRead = DateTime.UtcNow;
                message.IsRead = true;
                var connections = await _presenceTracker.GetConnectionForUser(recipent.Username);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved",
                        new
                        {
                            username = sender.Id,
                            knownas = sender.KnownAs
                        });

                }
            }
            else
            {
                var connections = await _presenceTracker.GetConnectionForUser(recipent.Username);
                if(connections!=null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved",
                        new
                        {
                            username = sender.Id,
                            knownas=sender.KnownAs
                        });

                }
            }


            _datingRepository.Add(message);
            if (await _datingRepository.SaveAll())
            {
               
                await Clients.Group(groupName).
                    SendAsync("NewMessage", _mapper.Map<MesssageToReturnDto>(message));

            }
         

        }

        private string GetGroupName(string caller,string other )
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{ other}" : $"{ other}-{caller}";

        }

    }
}
