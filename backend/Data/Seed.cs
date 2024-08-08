using backend.Data.Context;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class Seed
    {
        public static void SeedData(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                if (!context.Grounds.Any())
                {
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
                }

                if (!context.Fences.Any())
                {
                    context.Fences.AddRange(
                        new Fence
                        {
                            Name = "Wooden",
                            // img link: https://www.istockphoto.com/pl/wektor/sie%C4%87-gm1479544715-507499080
                            Img = "wooden",
                        },
                        new Fence
                        {
                            Name = "Hedge",
                            // img link: https://www.dreamstime.com/cartoon-bushes-green-plants-decorative-garden-hedge-flat-shrubbery-trees-deciduous-forest-elements-different-shapes-summer-park-image311366656
                            Img = "hedge",
                        }
                    );
                }

                context.SaveChanges();
            }
        }
    }
}