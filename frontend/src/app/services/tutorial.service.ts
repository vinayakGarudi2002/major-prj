import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore'; // Import from '@angular/fire/firestore' instead of '@angular/fire/compat/firestore'
import { Tutorial } from '../models/tutorial.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private dbPath = '/tutorials';

  tutorialsRef: AngularFirestoreCollection<Tutorial>;

  constructor(private db: AngularFirestore) {
    this.tutorialsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Tutorial> {
    return this.tutorialsRef;
  }

  create(tutorial: Tutorial): any {
    return this.tutorialsRef.add({ ...tutorial });
  }

  createOrUpdate(tutorial: Tutorial): any {
    // If the tutorial has an ID, check if it exists
    if (tutorial.id) {
      this.tutorialsRef.doc(tutorial.id).update(tutorial);
    } else {
      // If tutorial does not have an ID, simply create a new one
      return this.create(tutorial);
    }
  }

  update(id: string, data: any): Promise<void> {
    return this.tutorialsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.tutorialsRef.doc(id).delete();
  }

  getByField(field: string, value: any): Observable<Tutorial[]> {
    const queryFn: QueryFn = ref => ref.where(field, '==', value);
    return this.db.collection(this.dbPath, queryFn).valueChanges({ idField: 'id' }) as Observable<Tutorial[]>;
  }

  addFormConfiguration(formConfig: any) {
    // Assuming 'forms' is the collection in Firestore where you want to store form configurations
    return this.db.collection('forms').add({
      formName: formConfig.formName,
      formFields: formConfig.formFields,
      status: 'pending', // Add status and other fields as needed
      comments: '',
    });
  }
}
