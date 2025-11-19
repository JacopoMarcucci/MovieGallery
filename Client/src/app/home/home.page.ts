import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonFooter,
  IonItem,
  IonText,
  IonSearchbar,
  IonMenuButton,
  IonButtons,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  MenuController
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie/movie';
import { DataService } from '../services/data/data';
import { AuthService } from '../services/auth/auth-service';
import { Subscription } from 'rxjs';
import { RouterLink, Router } from '@angular/router';
import { MenuComponent } from '../components/menu/menu.component';        


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonCol,
    IonRow,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonFooter,
    IonItem, 
    IonText,
    IonSearchbar,
    RouterLink,
    IonMenuButton,
    IonButtons,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    MenuComponent,
    CommonModule
  ],
})

export class HomePage {
  filteredMovieData: any[]= [];
  query!: string;
  currentIndex = 0;
  pageSize = 20; // how many movies to show everytime
  
  private receivedObjectGenre: any = null;
  private isAuthenticated: boolean = false;
  username: string = '';

  private dataSubscription?: Subscription;
  private authSubscription?: Subscription;
 
  private moviesApi = inject(MovieService);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private router = inject(Router);  


  constructor(private menuCtrl: MenuController) {}

   ngOnInit() {
    this.subscribeObservable();
    this.moviesApi.loadMovies().subscribe(data => 
      this.filteredMovieData = data
    );
  }
  

ionViewWillEnter() {
  if (this.isAuthenticated) {
    this.username = this.authService.getUsername();
    this.menuCtrl.enable(true, 'home-menu');
  } else{
    console.error("User not authenticated in homepage. Redirecting to login.");
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }}

  ionViewWillLeave() {
  this.menuCtrl.enable(false, 'home-menu');
}

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

 subscribeObservable(){
   // Subscribe to the observable provided by the service

     this.authSubscription= this.authService.isLoggedIn.subscribe(status =>{
      this.isAuthenticated = status;
      console.log("Authentication status in Home Page: ", this.isAuthenticated);
      if (!this.isAuthenticated)
        this.router.navigateByUrl('/login', { replaceUrl: true });
     });
   
   this.dataSubscription = this.dataService.currentData$.subscribe((object: any) => {
      if (object) {
        console.log('Received object in Home Page:', object);
        this.receivedObjectGenre = object;
        this.filterForGenre();
      }
    });

 }


filterForGenre(){
      this.filteredMovieData = this.moviesApi.querySearch(this.receivedObjectGenre, "genres")!;
}


  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.moviesApi.loadMoreItems();                     // loads and appends more items
  this.filteredMovieData = this.moviesApi.filteredMovieData; // update list

  event.target.complete();
  }

  onSearchChange(event: any) {
    this.query = event.detail.value.toLowerCase();
    this.filteredMovieData = this.moviesApi.querySearch(this.query, "");
  }


  logout()  {
    this.authService.logout();
    console.log("User logged out, redirecting to login page.  ", this.isAuthenticated);
  };

  goToAdminPage() {
    if(this.isAdmin())
      this.router.navigateByUrl('/admin', { replaceUrl: true });
  }

  isAdmin(): boolean {
    const userType = this.authService.getUserType();
    return userType === 'Admin';
}


  openMenu() {
    this.menuCtrl.open('home-menu');
  }

}
