import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  MenuController
} from '@ionic/angular/standalone';
import { MovieService } from './services//movie/movie';
import { DataService } from './services/data/data';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
  ],
})


export class AppComponent {
  originalMovieData: any = [];
  genres: any[] = [];
  selectedGenre: string = 'All';
  private moviesApi = inject(MovieService);
  private dataService = inject(DataService);


 constructor(private menuCtrl: MenuController) {
  this.menuCtrl.enable(false, 'home-menu'); // disabled on all pages by default
}

  ngOnInit() {    
    this.getGenres();
  }

   getGenres() {
    this.moviesApi.getGenres().subscribe({
      next: (resp) => {
        this.genres = resp;
        console.log('Genres received in app component: ', this.genres);
      },
      error: (error) => console.error("API error: ", error)
    });
    
    
  }

  onGenreChange(event: any) {
    this.selectedGenre = event.detail.value;
    console.log('Selected genres are: ', this.selectedGenre);
      // 1. Update the shared service with the object
    this.dataService.updateSharedData(this.selectedGenre);

  }
}
