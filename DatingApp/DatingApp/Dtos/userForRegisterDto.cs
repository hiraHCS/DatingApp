﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Dtos
{
    public class userForRegisterDto
    {
        [Required]
        public string Username {get;set;}
        [Required]
        [StringLength(8,MinimumLength =4,ErrorMessage ="You must specify password 4 and 8")]
        public string password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string  KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public userForRegisterDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }





    }
}
