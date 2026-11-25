import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  async register(d: { nom: string; prenom: string; age: number; email: string; password: string; photo: string }) {
    const cred = await createUserWithEmailAndPassword(auth, d.email, d.password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      nom: d.nom, prenom: d.prenom, age: d.age, email: d.email,
      photo: d.photo, role: 'user', isActive: true, createdAt: Date.now()
    });
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (snap.exists() && snap.data()['isActive'] === false) {
      await signOut(auth);
      throw new Error('Compte désactivé par l’administrateur');
    }
    return snap.data();
  }

  logout() { return signOut(auth); }

  async isAdmin(uid: string) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() && snap.data()['role'] === 'admin';
  }
}