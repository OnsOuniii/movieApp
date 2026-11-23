import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { environment } from '../environments/environment';

// Initialisation de Firebase
const app = initializeApp(environment.firebase);

// Initialisation de Firestore
export const db = getFirestore(app);