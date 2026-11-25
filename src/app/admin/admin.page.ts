import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonToggle, IonInput, IonButton, IonAvatar
} from '@ionic/angular';
import { db } from '../firebase';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonItem, IonLabel, IonToggle, IonInput, IonButton, IonAvatar
  ]
})
export class AdminPage implements OnInit {
  users: any[] = [];
  movie = { title: '', year: null as number | null, genre: '', poster: '' };
  message = '';

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      const snap = await getDocs(collection(db, 'users'));
      this.users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e: any) {
      this.message = 'Erreur de chargement : ' + e.message;
    }
  }

  async toggle(u: any, active: boolean) {
    try {
      await updateDoc(doc(db, 'users', u.id), { isActive: active });
      u.isActive = active;
    } catch (e: any) {
      this.message = 'Erreur : ' + e.message;
    }
  }

  async addMovie() {
    try {
      await addDoc(collection(db, 'movies'), {
        ...this.movie,
        year: Number(this.movie.year)
      });
      this.movie = { title: '', year: null, genre: '', poster: '' };
      this.message = 'Film ajouté';
    } catch (e: any) {
      this.message = 'Erreur : ' + e.message;
    }
  }
}