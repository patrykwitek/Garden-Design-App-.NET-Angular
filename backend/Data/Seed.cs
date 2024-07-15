using backend.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class Seed
    {
        public static void SeedData(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                if (context.Grounds.Any())
                {
                    return;
                }

                context.Grounds.AddRange(
                    new Ground
                    {
                        Name = "Festuca rubra",
                        Img = "festuca rubra",
                        Description = "TODO" // TODO: remember about translations
                    },
                    new Ground
                    {
                        Name = "Poa pratensis",
                        Img = "poa pratensis",
                        Description = "TODO"
                    }
                );

                context.SaveChanges();
            }
        }
    }
}