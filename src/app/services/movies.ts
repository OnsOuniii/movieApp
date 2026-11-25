import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { environment } from '../../environments/environment';

export interface Movie {
  id: number;
  title: string;
  poster: string;
  year: number;
  genres: number[];
  actors: string[];
}

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private base = 'https://api.themoviedb.org/3';
  private key = environment.tmdbKey;

  async getPopular(): Promise<Movie[]> {
    const res = await fetch(`${this.base}/movie/popular?api_key=${this.key}&language=fr-FR`);
    const data = await res.json();
    return data.results.map((m: any) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : '',
      year: m.release_date ? +m.release_date.slice(0, 4) : 0,
      genres: m.genre_ids ?? [],
      actors: [],
    }));
  }

  async getActors(movieId: number): Promise<string[]> {
    const res = await fetch(`${this.base}/movie/${movieId}/credits?api_key=${this.key}`);
    const data = await res.json();
    return data.cast.slice(0, 5).map((a: any) => a.name);
  }

  // ---- Favoris (stockés dans users/{uid}.favorites) ----
  async getFavorites(): Promise<Movie[]> {
    const user = auth.currentUser;
    if (!user) return [];
    const snap = await getDoc(doc(db, 'users', user.uid));
    return snap.exists() ? (snap.data()['favorites'] ?? []) : [];
  }

  async toggleFavorite(movie: Movie): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    const favs = await this.getFavorites();
    const exists = favs.some((f) => f.id === movie.id);
    let updated: Movie[];
    if (exists) {
      updated = favs.filter((f) => f.id !== movie.id);
    } else {
      movie.actors = await this.getActors(movie.id);
      updated = [...favs, movie];
    }
    await setDoc(doc(db, 'users', user.uid), { favorites: updated }, { merge: true });
    return !exists;
  }

  async getAllUsers() {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
  }
}