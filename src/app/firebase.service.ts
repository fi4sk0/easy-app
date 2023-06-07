import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  Firestore,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  QuerySnapshot,
  doc,
  deleteDoc,
  limit,
  orderBy
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { Observable, ReplaySubject, Subject, firstValueFrom, map, switchMap } from 'rxjs';

export type PhaseType = 'sleep' | 'eat' | 'activity';

export interface Phase {
  type: PhaseType;
  createdAt: number;
}

export interface PhaseVisualType {
  type: PhaseType;
  label: string;
  color: string;
}

export const types = [
    {
      type: 'eat',
      label: 'Eat',
      color: 'bg-purple-300',
    },
    {
      type: 'activity',
      label: 'Active',
      color: 'bg-green-300',
    },
    {
      type: 'sleep',
      label: 'Sleep',
      color: 'bg-blue-300',
    },
  ] as PhaseVisualType[];

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCU4ZAsL5yg8EageWAyMxbIatsNcbiAKCg',
  authDomain: 'easy-app-d994b.firebaseapp.com',
  projectId: 'easy-app-d994b',
  storageBucket: 'easy-app-d994b.appspot.com',
  messagingSenderId: '435649157873',
  appId: '1:435649157873:web:09f2d428f252cf9314e750',
};

export interface FirebaseDocument<T>
{
  data: T,
  id: string
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app: FirebaseApp
  db: Firestore

  // phases: Observable<FirebaseDocument<Phase>[]>
  currentPhase: Observable<FirebaseDocument<Phase> | null>
  lastTwoPhases: Observable<FirebaseDocument<Phase>[] | null>

  authState = new ReplaySubject<User | null>(1)

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);


    const auth = getAuth()

    onAuthStateChanged(auth, this.authState)

    this.authState.subscribe(auth => console.log(auth))


    this.lastTwoPhases = this.authState.pipe(switchMap(auth => {
      
      const test = new Subject<QuerySnapshot<any>>()
      const q = query(collection(this.db, "phases"), where("uid", "==", auth?.uid), limit(2), orderBy("createdAt", "asc"));
      onSnapshot(q, test)
      return test
    
  }), map((querySnapshot) => {
    const d = [] as FirebaseDocument<Phase>[]
    querySnapshot.forEach(dd => d.push({data: dd.data(), id: dd.id}))
    return d
  }))

  this.currentPhase = this.lastTwoPhases.pipe(map(phases => phases?.length == 2 ? phases[1] : null))

  }

  getPhasesOfDay(startOfDay: number): Observable<FirebaseDocument<Phase>[]> {

    const start = new Date(startOfDay)

    // calculate start of day before
    const lowerBound = new Date(start.getFullYear(), start.getMonth(), start.getDate() - 1)
    const upperBound = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)

    return this.authState.pipe(switchMap(auth => {
      
      const test = new Subject<QuerySnapshot<any>>()
      const q = query(collection(this.db, "phases"), 
        where("uid", "==", auth?.uid), 
        where("createdAt", ">=", lowerBound.getTime()), 
        where("createdAt", "<", upperBound.getTime()))
      onSnapshot(q, test)
      return test
    
  }), map((querySnapshot) => {
    const d = [] as FirebaseDocument<Phase>[]
    querySnapshot.forEach(dd => d.push({data: dd.data(), id: dd.id}))
    return d.sort((a,b) => a.data.createdAt - b.data.createdAt)
  }))
  }



  async addPhase(type: PhaseType) {

    const phases = await firstValueFrom(this.lastTwoPhases)

    if (phases == null) {
      return
    }

    const currentPhase = phases[phases.length - 1];
    const previousPhase = phases[phases.length - 2];

    // Early return if user is trying to add the same phase again
    if (currentPhase?.data.type == type) {
      return;
    }

    // If the current phase was just created (within one minute), just overwrite 
    // the type instead of creating a new phase. If this results in a phase with
    // with the same type as the previous phase, delete the current phase.
    if (
      currentPhase != null &&
      Date.now() - currentPhase.data.createdAt < 60 * 1000
    ) {

      if (previousPhase?.data.type == type) {
        this.delete(currentPhase.id)
      } else {
        this.update(currentPhase.id, { type });
      }
      return
    }

    //   phases?.pop()

    //   const nowCurrentPhase = this.phases?.[this.phases.length - 1];

    //   if (nowCurrentPhase != null && nowCurrentPhase.type == type) {
    //     return
    //   }

    // }

    if (phases) {
      this.add({
        createdAt: Date.now(),
        type,
      });
    }
  }

  async add(doc: Phase) {

    const user = await firstValueFrom(this.authState)

    try {
      const docRef = await addDoc(collection(this.db, "phases"), {...doc, uid: user?.uid});
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
  }

  async update(id: string, phaseUpdate: Partial<Phase>) {
    try {
      
      const docReference = doc(this.db, "phases", id)
      updateDoc(docReference, phaseUpdate)
      
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e
    }
  }

  async delete(id: string) {
    try {
      const docReference = doc(this.db, "phases", id)
      await deleteDoc(docReference)
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw e
    }
  }

  async signup(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error)
        throw error
      });
  }

  async login(email: string, password: string) {
    const auth = getAuth()
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      console.log(user)
    }
    catch (e) {
      console.error(e)
      throw e
    }
    
  }
}
