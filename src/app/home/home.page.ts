
import { Component, inject  } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonCol, IonRow, IonImg, IonThumbnail, IonCard, IonLabel, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle} from '@ionic/angular/standalone';
import {Movie} from "../services/movie"

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,IonGrid, IonCol, IonRow, IonImg, IonThumbnail, IonCard, IonLabel,IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle],
})
export class HomePage {
  movieData: any [] = [];
  AllMovieData: any[] = [];

  private moviesApi = inject(Movie);
  
  constructor() {}

  ngOnInit(){
    this.getItem();
  }

  getItem(){
    this.AllMovieData = this.moviesApi.movieData; // saved in AllMovieData for the search bar, withouth calling the service again
    this.movieData = [...this.AllMovieData];
  }
   
  }

