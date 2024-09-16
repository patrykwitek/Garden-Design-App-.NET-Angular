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
                            Img = "wooden thumbnail",
                        },
                        new Fence
                        {
                            Name = "Hedge",
                            // img link: https://www.dreamstime.com/cartoon-bushes-green-plants-decorative-garden-hedge-flat-shrubbery-trees-deciduous-forest-elements-different-shapes-summer-park-image311366656
                            Img = "hedge thumbnail",
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
                        }
                    );
                }

                context.SaveChanges();
            }
        }
    }
}