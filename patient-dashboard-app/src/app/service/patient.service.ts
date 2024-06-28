import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { IPatient } from '../models/patient.model';
import { Observable, map } from 'rxjs';

const PATIENT_COLLECTION = 'patient';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patientsCollection;

  constructor(private firestore: Firestore) {
    this.patientsCollection = collection(this.firestore, PATIENT_COLLECTION);
  }

  // GET list of all patients
  getPatients(): Observable<IPatient[]> {
    const patients$ = collectionData(this.patientsCollection, { idField: 'id' });

    return patients$.pipe(
      map((patients) => {
        const convertedPatients = patients.map(patient => {
          return {
            ...patient,
            dateOfBirth: patient['dateOfBirth'].toDate()
          } as IPatient;
        });

        return convertedPatients;
      })
    );
  }

  // POST new patient
  addPatient(patient: IPatient): Promise<void> {
    const newDocRef = doc(this.patientsCollection);
    return setDoc(newDocRef, patient);
  }
}
