using System.Security.Cryptography;
using System.Text;
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
                if (!context.Users.Any(user => user.UserName == "admin"))
                {
                    using HMACSHA512 hmac = new HMACSHA512();
                    User adminUser = new User
                    {
                        UserName = "admin",
                        DateOfBirth = DateTime.UtcNow,
                        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("AdminPassword123@")),
                        PasswordSalt = hmac.Key,
                        Role = "admin",
                        Language = "en"
                    };

                    context.Users.Add(adminUser);
                }

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
                            Img = "wooden thumbnail",
                        },
                        new Fence
                        {
                            Name = "Hedge",
                            // img link: https://www.dreamstime.com/cartoon-bushes-green-plants-decorative-garden-hedge-flat-shrubbery-trees-deciduous-forest-elements-different-shapes-summer-park-image311366656
                            Img = "hedge thumbnail",
                        },
                        new Fence
                        {
                            Name = "Wire",
                            // img link: https://www.dreamstime.com/realistic-detailed-d-silhouette-black-metal-fence-wire-mesh-set-vector-illustration-frame-private-concept-realistic-image158636623
                            Img = "wire fence thumbnail",
                        }
                    );
                }

                if (!context.Environments.Any())
                {
                    context.Environments.AddRange(
                        new Entities.Environment
                        {
                            Name = "None"
                            // img link: https://www.istockphoto.com/pl/wektor/ikona-wektora-x-znacznika-stylu-p%C5%82askiego-na-bia%C5%82ym-gm898741098-248002060
                        },
                        new Entities.Environment
                        {
                            Name = "Forest"
                            // img link: https://www.istockphoto.com/pl/wektor/krajobraz-jeziora-gm1143206930-306921790
                        },
                        new Entities.Environment
                        {
                            Name = "City"
                            // img link: https://www.istockphoto.com/pl/wektor/manhattan-panoram%C4%99-gm92712733-10230737
                        }
                    );
                }

                if (!context.ElementCategories.Any())
                {
                    context.ElementCategories.AddRange(
                        new ElementCategory
                        {
                            Name = "Pavement",
                            // img link: https://ambientcg.com/view?id=PavingStones081
                        },
                        new ElementCategory
                        {
                            Name = "Tree",
                            // img link: https://www.istockphoto.com/pl/wektor/zestaw-drzew-gm1393465651-449311815
                        },
                        new ElementCategory
                        {
                            Name = "Bush",
                            // img link: https://www.istockphoto.com/pl/wektor/zestaw-drzew-gm1393465651-449311815
                        },
                        new ElementCategory
                        {
                            Name = "Flower",
                            // img link: https://www.istockphoto.com/pl/wektor/wiosenna-trawa-granica-z-wczesn%C4%85-wiosn%C4%85-kwiaty-i-motyl-izolowane-na-bia%C5%82ym-tle-gm1129847617-298616893
                        },
                        new ElementCategory
                        {
                            Name = "Bench",
                            // img link: https://www.istockphoto.com/pl/wektor/%C5%82awka-ogrodowa-kresk%C3%B3wkowe-drewniane-i-wiklinowe-meble-na-ulice-i-parki-zestaw-gm1331220354-414419829
                        }
                    );
                }

                if (!context.Elements.Any())
                {
                    context.Elements.AddRange(
                        new Element
                        {
                            Name = "Stone",
                            Category = "Pavement"
                            // img link: https://ambientcg.com/view?id=PavingStones081
                        },
                        new Element
                        {
                            Name = "Paving Stone",
                            Category = "Pavement"
                            // img link: https://ambientcg.com/view?id=PavingStones080
                        },
                        new Element
                        {
                            Name = "Grit",
                            Category = "Pavement"
                            // img link: https://ambientcg.com/view?id=Ground062S
                        },
                        new Element
                        {
                            Name = "Pine",
                            Category = "Tree"
                            // img link: https://www.istockphoto.com/pl/wektor/zestaw-drzew-ilustracja-z-kresk%C3%B3wek-wektorowych-gm1159273177-316932044
                        },
                        new Element
                        {
                            Name = "Oak",
                            Category = "Tree"
                            // img link: https://www.istockphoto.com/pl/wektor/zestaw-drzew-ilustracja-z-kresk%C3%B3wek-wektorowych-gm1159273177-316932044
                        },
                        new Element
                        {
                            Name = "Birch",
                            Category = "Tree"
                            // img link: https://www.vecteezy.com/vector-art/47790788-birch-tree-flat-illustration-on-white-background
                        },
                        new Element
                        {
                            Name = "Juniper",
                            Category = "Bush"
                            // img link: https://www.istockphoto.com/pl/wektor/zestaw-drzew-ilustracja-z-kresk%C3%B3wek-wektorowych-gm1159273177-316932044
                        },
                        new Element
                        {
                            Name = "Yew",
                            Category = "Bush"
                            // img link: https://www.istockphoto.com/pl/wektor/zestaw-drzew-ilustracja-z-kresk%C3%B3wek-wektorowych-gm1159273177-316932044
                        },
                        new Element
                        {
                            Name = "Salix caprea",
                            Category = "Bush"
                            // img link: https://www.istockphoto.com/pl/wektor/zestaw-drzew-ilustracja-z-kresk%C3%B3wek-wektorowych-gm1159273177-316932044
                        },
                        new Element
                        {
                            Name = "Crocus",
                            Category = "Flower"
                            // img link: https://www.istockphoto.com/pl/wektor/cartoon-garden-kwiaty-i-element-zestaw-wektor-gm956341846-261114781
                        },
                        new Element
                        {
                            Name = "Narcissus",
                            Category = "Flower"
                            // img link: https://www.istockphoto.com/pl/wektor/cartoon-garden-kwiaty-i-element-zestaw-wektor-gm956341846-261114781
                        },
                        new Element
                        {
                            Name = "Tulip",
                            Category = "Flower"
                            // img link: https://www.istockphoto.com/pl/wektor/cartoon-garden-kwiaty-i-element-zestaw-wektor-gm956341846-261114781
                        },
                        new Element
                        {
                            Name = "Wooden",
                            Category = "Bench"
                            // img link: https://www.istockphoto.com/pl/wektor/%C5%82awka-ogrodowa-kresk%C3%B3wkowe-drewniane-i-wiklinowe-meble-na-ulice-i-parki-zestaw-gm1331220354-414419829
                        },
                        new Element
                        {
                            Name = "Modern",
                            Category = "Bench"
                            // img link: https://www.istockphoto.com/pl/wektor/%C5%82awka-ogrodowa-kresk%C3%B3wkowe-drewniane-i-wiklinowe-meble-na-ulice-i-parki-zestaw-gm1331220354-414419829
                        },
                        new Element
                        {
                            Name = "Metal",
                            Category = "Bench"
                            // img link: https://www.istockphoto.com/pl/wektor/%C5%82awka-ogrodowa-kresk%C3%B3wkowe-drewniane-i-wiklinowe-meble-na-ulice-i-parki-zestaw-gm1331220354-414419829
                        }
                    );
                }

                context.SaveChanges();
            }
        }
    }
}