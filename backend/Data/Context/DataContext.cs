using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Context;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Ground> Grounds { get; set; }
    public DbSet<Fence> Fences { get; set; }
    public DbSet<Entrance> Entrances { get; set; }
    public DbSet<ElementCategory> ElementCategories { get; set; }
    public DbSet<Element> Elements { get; set; }
    public DbSet<GardenElement> GardenElements { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}
