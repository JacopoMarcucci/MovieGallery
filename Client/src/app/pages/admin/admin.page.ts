import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonRow,
    IonCol,
  ],
})
export class AdminPage implements OnInit {
  private authSubscription?: Subscription;
  isAuthenticated: boolean = false;
  users: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscribeObservable();
  }

  ionViewWillEnter() {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Fetched users for admin page:', this.users);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  subscribeObservable() {
    // Subscribe to the observable provided by the service
    this.authSubscription = this.authService.isLoggedIn.subscribe((status) => {
      this.isAuthenticated = status;
      console.log(
        'Authentication status in Admin page: ',
        this.isAuthenticated
      );
      if (!this.isAuthenticated)
        this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }

  deleteUser(userId: number) {
    
    this.authService.deleteUser(userId).subscribe({
      next: () => {
        console.log(`User with ID ${userId} deleted successfully.`);
        this.users = this.users.filter((user) => user.userID !== userId);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      },
    });
  }

  gotoHomePage() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

}
