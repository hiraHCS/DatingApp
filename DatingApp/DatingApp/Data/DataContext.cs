
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;
namespace DatingApp.Data
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions<DataContext>options):base (options){


        }
        public DbSet <Value> Values { get; set; }
        public DbSet <User>  users { get; set; }
        public DbSet <Photo> Photo { get; set; }
        public DbSet <Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
          builder.Entity<Like>()
                .HasKey(k => new { k.LikerId, k.LikeeId });

          builder.Entity<Like>()
              .HasOne(k => k.Likee)
              .WithMany(k => k.Likers)
              .HasForeignKey(k => k.LikeeId)
              .OnDelete(DeleteBehavior.Restrict);

          builder.Entity<Like>()
          .HasOne(k => k.Liker)
          .WithMany(k => k.Likees)
          .HasForeignKey(k => k.LikerId)
          .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessageSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
            .HasOne(u => u.Recipient)
            .WithMany(m => m.MessageReceived)
            .OnDelete(DeleteBehavior.Restrict);



        }
    }
}