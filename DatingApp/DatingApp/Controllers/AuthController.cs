﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.Dtos;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo,IConfiguration config  ,IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult>Register(userForRegisterDto userForRegisterDto)
        {
            //validate request
            //if (!ModelState.IsValid)
            //return BadRequest(ModelState);
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exists");
            //var userToCreate = new User
            //{
            //    Username = userForRegisterDto.Username            
            //};
            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            var createdUser = await _repo.Register(userToCreate,userForRegisterDto.password);
            var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);
            return CreatedAtRoute("GetUser",new { controller = "Users", id=createdUser.Id},userToReturn);
        }
        [HttpPost("Login")]
        public async Task <IActionResult>Login(UserForLoginInfoDto userforLoginInfoDto)
        {
                //throw new Exception("computer says no");
                var userFromRepo = await _repo.Login(userforLoginInfoDto.Username.ToLower(), userforLoginInfoDto.Password);
                if (userFromRepo == null)
                {
                    return Unauthorized(); 
                }
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                    new Claim(ClaimTypes.Name,userFromRepo.Username)                    
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var user = _mapper.Map<UserForListDto>(userFromRepo);
                return Ok(new {
                    token = tokenHandler.WriteToken(token),
                    user = user
                     }); ;     
                //throw new Exception("Computer says no");
        }



    }
}