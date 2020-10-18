using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    //[Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController:ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo,IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }
        [HttpGet("{id}",Name ="GetMessage")]
        public async Task<IActionResult>GetMessage(int userId,int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var messageFromRepo = await _repo.GetMessage(id);
            if(messageFromRepo==null)
            { return NotFound(); }
            return Ok(messageFromRepo);

        }
        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId,int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            { return Unauthorized(); }
            var messageFromRepo = await _repo.GetMessageThread(userId, recipientId);
            var messageThread = _mapper.Map<IEnumerable<MesssageToReturnDto>>(messageFromRepo);
            return Ok(messageThread);
        }


        [HttpGet]
        public async Task<IActionResult>GetMessageForUser(int userId, [FromQuery]
        MessageParams messageParams)
       {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized(); 
            }
            messageParams.UserId = userId;
            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);
            var messages = _mapper.Map<IEnumerable<MesssageToReturnDto>>(messagesFromRepo);
            Response.AddPagination
                (
                messagesFromRepo.CurrentPage, messagesFromRepo.PageSize
                , messagesFromRepo.TotalCount, messagesFromRepo.TotalPages
                );
            return Ok(messages);
        }
        [HttpPost]
        public async Task<IActionResult>CreateMessage(MessageForCreationDto messageForCreationDto)
        {
            var username = User.GetUsername();
            if (User.GetUserid()!= messageForCreationDto.SenderId)
            {
                return Unauthorized();
            }

            var sender = await _repo.GetUser(User.GetUserid());
            var recipent = await _repo.GetUser(messageForCreationDto.RecipientId);
            if(recipent==null)
            {
                return NotFound();
                    
            }
            var message = new Message
            {
                Sender = sender,
                Recipient = recipent,
                SenderId = sender.Id,
                RecipientId = recipent.Id,
                Content = messageForCreationDto.Content,
                MessageSent=DateTime.Now
            };
            _repo.Add(message);
            if(await _repo.SaveAll())
            {
                return Ok(_mapper.Map<MesssageToReturnDto>(message));

            }
            return BadRequest("Failed to send message");
        }
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id,int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            { return Unauthorized(); }
            var messageFromRepo = await _repo.GetMessage(id);
            if(messageFromRepo.SenderId==userId)
            {
                messageFromRepo.SenderDeleted = true;
            }
            if(messageFromRepo.RecipientId==userId)
            {
                messageFromRepo.RecipientDeleted = true;
            }
            if(messageFromRepo.SenderDeleted&&messageFromRepo.RecipientDeleted)
            {
                _repo.Delete(messageFromRepo);
            }
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            else
            {
                throw new Exception("Error deleting the message");
            }
            
        }
        [HttpPost("{id}/read",Name ="Read")]
      
        public async Task <IActionResult>MarkMessageAsRead([FromRoute]  int userId,int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            { return Unauthorized(); }
            var messageFromRepo = await _repo.GetMessage(id);
            var message= await _repo.GetMessage(id);
            if (message.RecipientId!=userId)
            {
                return Unauthorized();
            }
            message.IsRead = true;
            message.DateRead = DateTime.Now;
            await _repo.SaveAll();
            return NoContent();


        }

    }
}