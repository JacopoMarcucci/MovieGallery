using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieGallery_API.Filters;
using MovieGallery_API.Models.stage_jacopo;


namespace MovieGallery_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class MoviesController : Controller
    { 
        
        private readonly stage_jacopoContext _context;

        public MoviesController(stage_jacopoContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> getAllMovies()
        {
            var movies = await _context.Movies.ToListAsync();
            return Ok(movies);
        }   
        
    

        [HttpGet("Genres")]
        public async Task<IActionResult> getAllGenres()
        {

            var genres = await _context.Movies
                                           .Select(m => m.Genres) // Flatten the list of lists into a single list of strings
                                           .Distinct()           // Get unique genre names
                                           .OrderBy(g => g)      // Order alphabetically
                                           .ToListAsync();       // Execute the query asynchronously
           
            var response = genres
            .SelectMany(genreString => genreString.Split(new[] { ", " }, StringSplitOptions.RemoveEmptyEntries))
            .Where(genre => !string.IsNullOrWhiteSpace(genre)) // Ensure we remove empty strings 
            .Distinct()
            .OrderBy(genre => genre)
            .ToList();

            return Ok(response);
        }

    }
}
