import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonImg } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [ReactiveFormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonImg]
})
export class RegisterPage {
  photo = '';
  error = '';
  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    age: [null as number | null, [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  async takePhoto() {
    const img = await Camera.getPhoto({
      quality: 50, width: 300,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    this.photo = img.dataUrl ?? '';
  }

  async submit() {
    try {
      const v = this.form.value;
      await this.auth.register({ ...v, age: Number(v.age), photo: this.photo } as any);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e.message;
    }
  }
}