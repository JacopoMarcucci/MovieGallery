using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieGallery_API.Filters;
using MovieGallery_API.Models.stage_jacopo;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;



namespace MovieGallery_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly stage_jacopoContext _context;
        private IConfiguration _config;

        public AuthController(stage_jacopoContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }



        // GET: api/Auth
        [HttpGet]
        [AuthorizeByUserType("Admin")]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }


        // GET: api/Auth/5
        [HttpGet("{id}")]
        [AuthorizeByUserType("Admin")]
        public async Task<ActionResult<Users>> GetUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound();
            }

            return users;
        }

        // PUT: api/Auth/5
        [HttpPut("{id}")]
        [AuthorizeByUserType("Admin")]
        public async Task<IActionResult> PutUsers(int id, Users users)
        {
            if (id != users.UserID)
            {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Auth
        [HttpPost]
        public async Task<ActionResult<Users>> Login(Users user)
        {
            var userQuery = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == user.Username);

            if (userQuery == null || userQuery.Password != user.Password)
            {
                return Unauthorized("Invalid username or password");
            }
            

            var token = GenerateJwtToken(userQuery);
            Console.WriteLine(token);
            return Ok(new
            {
                TokenHandler = token,
                UserTypeResp = userQuery.UserType
            }); 
        }



        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register(Users credentials)
        {

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == credentials.Username);

            if (existingUser != null)
            {
                return Conflict("Username is already taken.");
            }

            var newUser = new Users
            {
                Username = credentials.Username,
                Password = credentials.Password, 
                UserType = "User"
   
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            string token = GenerateJwtToken(newUser);

            return Ok(new
            {
                TokenHandler = token
            }); ;
        }



        // DELETE: api/Auth/5
        [HttpDelete("{id}")]
        [AuthorizeByUserType("Admin")]
        public async Task<IActionResult> DeleteUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);
            if (users == null)
            {
                return NotFound();
            }

            _context.Users.Remove(users);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.UserID == id);
        }



        private string GenerateJwtToken(Users user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("qwertyuiop1234567890qwertyuiop1234567890"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Claims provide information about the user
            List<Claim> claims = new List<Claim>()
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iss, _config["Jwt:Issuer"]),
            new Claim(JwtRegisteredClaimNames.Aud, _config["Jwt:Audience"]),
            new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                                                    ClaimValueTypes.Integer64),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("UserTypeLogged", user.UserType),
        };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30), 
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



    }
}
