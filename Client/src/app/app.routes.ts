import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    providers: [
      provideHttpClient()
    ],
    children: [
      {
        path: "",
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'movies/:movieId',  // The ":movieId" is the dynamic parameter placeholder
        loadComponent: () =>
          import('./home/movie-detail/movie-detail.page').then(
            (m) => m.MovieDetailPage
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then( m => m.AdminPage)
  },

 

];
