import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable, tap, map } from 'rxjs'; // Import necessary RxJS operators
import { AuthService } from '../auth/auth-service';
@Injectable({
  providedIn: 'root',
})

export class MovieService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiURL : string = "http://localhost:5006/api/Movies"
  private movieData: any = []; 
  filteredMovieData: any = [];
  originalMovieData: any = []; //for the SearchBar
  IdMovieData: any[] = [];
  currentIndex = 0;
  pageSize = 20; // how many movies to show everytime

  
////////////  Homepage //////////  

    
 loadMovies(): Observable<any[]> {
  return this.http.get<any[]>(this.apiURL, {
    headers: this.authService.createAuthHeaders()
  }).pipe(
    tap(resp => {
      this.originalMovieData = resp;
      this.filteredMovieData = [];
      this.currentIndex = 0;

      this.loadMoreItems();   // load first page
    }),
    map(() => this.filteredMovieData)
  );
}

public loadMoreItems() {
  if (!this.originalMovieData.length) return;

  const nextItems = this.originalMovieData.slice(
    this.currentIndex,
    this.currentIndex + this.pageSize
  );

  this.filteredMovieData = [...this.filteredMovieData, ...nextItems];

  this.currentIndex += this.pageSize;
  return this.filteredMovieData;
}



  querySearch(query: any, filter: string) : any {
    this.filteredMovieData = [];
    console.log('FIlter:', filter);
    if (query.length > 0) {
      if(filter === ""){
          this.searchMoviesTitle(query);
      } 
      else{
       if(filter === "genres")this.searchMoviesGenre(query);
        }
    } else {
      this.filteredMovieData = [...this.originalMovieData];
    }
    return this.filteredMovieData;
  }



  private searchMoviesTitle(query : string) {
    this.filteredMovieData = this.originalMovieData.filter((movie: any) =>
      movie.title.toLowerCase().includes(query)
    );
  }




  private searchMoviesGenre(query: any) {

    const queryArray = (Array.isArray(query)
      ? query.map((q: any) => String(q).toLowerCase().trim())
      : [String(query ?? '').toLowerCase().trim()]
    ).filter(Boolean);

    if (queryArray.length === 0) {
      this.filteredMovieData = [...this.originalMovieData];
      return;
    }

    this.filteredMovieData = this.originalMovieData.filter((movie: any) => {
      const g = movie?.genres;
      if (!g) return false;

      if (Array.isArray(g)) {
        // OR-match: keep movie if any genre element matches any selected query
        return g.some((gg: any) =>
          queryArray.some((q: string) => String(gg ?? '').toLowerCase().includes(q))
        );
      }
      // genres is a string
      return queryArray.some((q: string) => String(g).toLowerCase().includes(q));
    });
  }
 


  /////////// movie-detail page /////////////
  getMovie( movieId : string | null){
    this.IdMovieData = this.filteredMovieData.find((movie : any) =>
      movie.movieID == movieId);
    return this.IdMovieData;
  }

///////////// menu ////////////
  getGenres() : Observable<any> {
    const allGenres = this.http.get(this.apiURL+"/Genres");
    return allGenres; 
  }

  getMovieData() {
    return this.movieData;
  }
}


