import { Injectable } from '@angular/core';
import { Movie } from './movies';

@Injectable({ providedIn: 'root' })
export class MatchingService {
  private jaccard(a: Set<any>, b: Set<any>): number {
    if (a.size === 0 && b.size === 0) return 0;
    const inter = [...a].filter((x) => b.has(x)).length;
    const union = new Set([...a, ...b]).size;
    return inter / union;
  }

  score(mine: Movie[], other: Movie[]): number {
    const ids = (l: Movie[]) => new Set(l.map((m) => m.id));
    const genres = (l: Movie[]) => new Set(l.flatMap((m) => m.genres));
    const actors = (l: Movie[]) => new Set(l.flatMap((m) => m.actors));
    const decades = (l: Movie[]) => new Set(l.map((m) => Math.floor(m.year / 10)));

    const total =
      0.3 * this.jaccard(ids(mine), ids(other)) +
      0.3 * this.jaccard(genres(mine), genres(other)) +
      0.25 * this.jaccard(actors(mine), actors(other)) +
      0.15 * this.jaccard(decades(mine), decades(other));

    return Math.round(total * 100);
  }
}