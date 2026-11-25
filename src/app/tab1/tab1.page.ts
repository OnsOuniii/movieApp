
import { Component, OnInit } from '@angular/core';

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
import { heart, heartOutline } from 'ionicons/icons';

import { Movie, MoviesService } from '../services/movies';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
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
export class Tab1Page implements OnInit {

  movies: Movie[] = [];
  favIds = new Set<number>();

  constructor(private moviesService: MoviesService) {
    addIcons({ heart, heartOutline });
  }

  async ngOnInit() {
    this.movies = await this.moviesService.getPopular();

    const favs = await this.moviesService.getFavorites();
    this.favIds = new Set(favs.map((f) => f.id));
  }

  async toggle(movie: Movie) {
    const added = await this.moviesService.toggleFavorite(movie);

    if (added) {
      this.favIds.add(movie.id);
    } else {
      this.favIds.delete(movie.id);
    }
  }
}
