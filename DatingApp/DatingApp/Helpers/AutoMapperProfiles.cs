using AutoMapper;
using DatingApp.Dtos;
using DatingApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Helpers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>().
                ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(
                         p => p.IsMain).Url))
                .ForMember
                         (dest=>dest.Age,opt=>opt.MapFrom(src=>src.DateOfBirth.CalculateAge()))
                
                ;
            CreateMap<User, UserForDetailedDto>().
                  ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(
                         p => p.IsMain).Url))
                  .ForMember
                         (dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotosForDetailedDto>();

            CreateMap<Photo, PhotoForReturnDto>();

            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<UserForUpdateDto,User>();
            CreateMap<userForRegisterDto, User>();
            CreateMap<MessageForCreationDto, Message>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MesssageToReturnDto>()
         .ForMember(m=>m.SenderPhotoUrl,opt=>opt
         .MapFrom(u=>u.Sender.Photos.FirstOrDefault(p=>p.IsMain).Url))
         .ForMember(m => m.RecipientPhotoUrl, opt => opt
         .MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<DateTime, DateTime>().ConstructUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }
    }
    
}
