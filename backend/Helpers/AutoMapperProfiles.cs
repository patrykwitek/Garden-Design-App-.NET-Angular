using AutoMapper;
using backend.DTO;
using backend.Entities;

namespace backend.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterDto, User>();
            CreateMap<Project, ProjectDto>()
                .ForMember(dest => dest.OwnerUsername, opt => opt.MapFrom(src => src.User.UserName));
            CreateMap<DateTime, DateTime>()
                .ConvertUsing(date => DateTime.SpecifyKind(date, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>()
                .ConvertUsing(date => date.HasValue ? DateTime.SpecifyKind(date.Value, DateTimeKind.Utc) : null);
            CreateMap<Entrance, EntranceDto>().ReverseMap();
            CreateMap<User, UserDataDto>();
        }
    }
}