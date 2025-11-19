using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using NuGet.Common;
using System.Net;

namespace MovieGallery_API.Filters
{
    public class AuthorizeByUserType : Attribute, IAuthorizationFilter
    {
        private readonly string _userTypeRequest;
        public AuthorizeByUserType( string userType) { 
            _userTypeRequest = userType;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var claims = context.HttpContext.User.Claims;
            
            var userType = claims.FirstOrDefault(c => c.Type == "UserTypeLogged")?.Value;

            Console.WriteLine($"\n User Type: {userType} \n");

            if (userType is null || userType != _userTypeRequest)
            {
                context.Result = new StatusCodeResult((int)HttpStatusCode.Forbidden);
            }

            
        }
    }
}
