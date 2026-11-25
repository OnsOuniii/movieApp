
import { Component } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

import { Movie, MoviesService } from '../services/movies';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonIcon
  ],
})
export class Tab2Page {

  favorites: Movie[] = [];

  constructor(private moviesService: MoviesService) {
    addIcons({ trashOutline });
  }

  async ionViewWillEnter() {
    this.favorites = await this.moviesService.getFavorites();
  }

  async remove(movie: Movie) {
    await this.moviesService.toggleFavorite(movie);

    this.favorites = this.favorites.filter(
      (f) => f.id !== movie.id
    );
  }
}
