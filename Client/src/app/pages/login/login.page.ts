import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth-service';
import { Router } from '@angular/router';
import {
  IonContent,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    ReactiveFormsModule,
    IonInput,
  ],
})


export class LoginPage implements OnInit {
  @ViewChild('LoginForm') form? : NgForm ;
  submissionType: 'login' | 'register' = 'login';

  authApi = inject(AuthService);
  router = inject(Router);
  formData! : NgForm ;
  response: any ; 

  constructor() {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.authApi.isTokenValid()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(loginForm: NgForm) {
    if (loginForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    this.formData= loginForm;
    if(this.submissionType === "login")
        this.login();
      else if (this.submissionType === "register")
        this.register();

      loginForm.resetForm();
  }


  login(){
    this.authApi.login(this.formData.value).subscribe({
      next: (resp) => {
        this.response = resp;
        console.log('Response Login: ', this.response );
        this.router.navigate(["/home"]);
      },
      error: (error) => console.error("API error: ", error)
    });
  }

  register(){
    this.authApi.register(this.formData.value).subscribe({
      next: (resp) => {
        this.response = resp;
        console.log('AFTER register: this.response', this.response );
        this.router.navigate(["/home"]);
      },
      error: (error) => console.error("API error: ", error)
    });
  }

  toggleText() {
    this.submissionType === 'login'
      ? (this.submissionType = 'register')
      : (this.submissionType = 'login');
  }
}
