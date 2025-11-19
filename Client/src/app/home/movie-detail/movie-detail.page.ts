import { Component,  inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonLabel, IonItem,   } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie/movie';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonLabel,
     IonItem,]
})
export class MovieDetailPage implements OnInit {
  movieId: string | null = "";
  movieData: any = [];
  private activatedRoute = inject(ActivatedRoute);
  private moviesApi = inject(MovieService);

  constructor() { }

  ngOnInit() {
    this.movieId = this.activatedRoute.snapshot.paramMap.get('movieId');
     console.log("check id: ", this.movieId);
    this.movieData = this.movieId !== null ? this.moviesApi.getMovie(this.movieId) : undefined;
  }

}
