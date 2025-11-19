import { Component, inject, Input, OnInit } from '@angular/core';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonSelect, IonSelectOption, IonRouterOutlet, IonMenuToggle } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data/data';
import { MovieService } from 'src/app/services/movie/movie';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonRouterOutlet,
    IonMenuToggle,
  ]
})
export class MenuComponent  implements OnInit {

  @Input()  idContent!: string;
  
 originalMovieData: any = [];
  genres: any[] = [];
  selectedGenre: string = '';
  private moviesApi = inject(MovieService);
  private dataService = inject(DataService);

  constructor() {}

  ngOnInit() {
    this.getGenres();
    console.log("menu component: OnINit");
  }

   getGenres() {
    console.log(" getGenres() ");
    this.moviesApi.getGenres().subscribe({
      next: (resp) => {
        this.genres = resp;
        console.log("Genres loaded: ", this.genres);
      },
      error: (error) => console.error("API error: ", error)
    });
  }

  onGenreChange(event: any) {
    this.selectedGenre = event.detail.value;
    console.log('Selected genres are: ', this.selectedGenre);

    this.dataService.updateSharedData(this.selectedGenre);

  }

  test() {
    console.log("test menu component");
  }

}
