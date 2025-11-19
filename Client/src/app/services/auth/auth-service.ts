import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs'; // Import necessary RxJS operators
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private apiUrl: string = 'http://localhost:5006/api/Auth';
  private response: any;
  private _isLoggedIn = new BehaviorSubject(false);
  isLoggedIn: Observable<boolean> = this._isLoggedIn.asObservable();
  private TOKEN_KEY: string = 'AuthToken';
  private USER_TYPE_KEY: string = 'UserType';
  private username: any = '';

  constructor(private router: Router) {
    this.checkLoginStatusOnAppLoad();
    this.logoutStorage();
  }

  login(credentials: any): Observable<any[]> {
    console.log('credentials for login are : ', credentials);
    this.response = this.httpClient.post<any[]>(this.apiUrl, credentials).pipe(
      tap((resp: any) => {
        this.loginStorage(resp.tokenHandler, resp.userTypeResp);
        this.username = credentials.Username;
        console.log(
          'User logged in successfully, username set to:',
          this.username
        );
      }),

      catchError((error) => {
        console.error('An error occurred during login:', error);
        this.logoutStorage();
        return throwError(
          () => new Error('Login failed; please try again later.')
        );
      })
    );

    return this.response;
  }

  register(credentials: any): Observable<any[]> {
    console.log('credentials for  "authService.register"  are : ', credentials);
    this.response = this.httpClient
      .post<any[]>(this.apiUrl + '/register', credentials)
      .pipe(
        tap((resp: any) => {
          this.loginStorage(resp.tokenHandler, resp.userType);
          this.username = credentials.username;
          console.log(
            'User registered in successfully, username set to:',
            this.username
          );
        }),

        catchError((error) => {
          console.error('An error occurred during login:', error);
          return throwError(
            () => new Error('Login failed; please try again later.')
          );
        })
      );

    console.log('resp for  "authService.register"  is : ', this.response);
    return this.response;
  }

  logout() {
    this.logoutStorage();
  }

  loginStorage(token: string, userType: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_TYPE_KEY, userType);
    this._isLoggedIn.next(true);
  }

  logoutStorage() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    this._isLoggedIn.next(false);
  }

  checkLoginStatusOnAppLoad() {
    if (this.isTokenValid()) {
      this._isLoggedIn.next(true);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      console.error('You are not logged in');
      this.logoutStorage();
      this._isLoggedIn.next(false);
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  isTokenValid(): boolean {
    /////////// Implement token validation logic here

    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      return false;
    }

    // Use a regular expression '/\./' to split by a literal dot,
    // because a simple '.' in split treats it as a special regex character matching any character.
    const parts = token.split(/\./);
    return parts.length === 3;
  }

  getUsername(): string {
    return this.username;
  }

  getUserType(): string | null {
    return localStorage.getItem(this.USER_TYPE_KEY);
  }

  
  createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.logoutStorage();
      throw new Error(
        'No authentication token found. createAuthHeaders() failed.'
      );
    }
    //console.log('header in createAuthHeaders(): ', new HttpHeaders({ Authorization: `Bearer ${token}` }));
    console.log('token in createAuthHeaders(): ', token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /////////////////  Admin methods  ///////////////////////


  getAllUsers(): Observable<any[]> {
    return this.httpClient
      .get<any[]>(this.apiUrl, {
        headers: this.createAuthHeaders(),
      })
      .pipe(
        tap((data) => console.log('Fetched data:', data)),
        catchError((error) => {
          console.error('An error occurred during fetching all users:', error);
          return throwError(() => {
            new Error('Failed to fetch users; please check permissions.');
            this.router.navigateByUrl('/login', { replaceUrl: true });
          });
        })
      );
  }

  deleteUser(userId: number): Observable<any> {
    this.response = this.httpClient
      .delete<any>(`${this.apiUrl}/${userId}`, {
        headers: this.createAuthHeaders(),
      })
      .pipe(
        tap(() => console.log(`Deleted user with ID: ${userId}`)),
        catchError((error) => {
          console.error('An error occurred during user deletion:', error);
          return throwError(
            () => new Error('User deletion failed; please try again later.')
          );
        })
      );
    return this.response;
  }
}
