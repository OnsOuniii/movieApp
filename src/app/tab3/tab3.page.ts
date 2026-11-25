
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge
} from '@ionic/angular';

import { auth } from '../firebase';
import { MoviesService } from '../services/movies';
import { MatchingService } from '../services/matching';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge
  ],
})
export class Tab3Page {

  matches: {
    nom: string;
    prenom: string;
    photo?: string;
    score: number;
  }[] = [];

  constructor(
    private moviesService: MoviesService,
    private matchingService: MatchingService
  ) {}

  async ionViewWillEnter() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      this.matches = [];
      return;
    }

    try {
      const myFavorites = await this.moviesService.getFavorites();
      const users = await this.moviesService.getAllUsers();

      this.matches = users
        .filter(user =>
          user.uid !== currentUser.uid &&
          user.active !== false
        )
        .map(user => ({
          nom: user.nom,
          prenom: user.prenom,
          photo: user.photo,
          score: this.matchingService.score(
            myFavorites,
            user.favorites ?? []
          )
        }))
        .filter(user => user.score > 75)
        .sort((a, b) => b.score - a.score);

    } catch (error) {
      console.error('Erreur lors du chargement des correspondances :', error);
      this.matches = [];
    }
  }
}
