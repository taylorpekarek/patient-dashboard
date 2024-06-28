import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc
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

  // GET list of all patients and filter is a search string is passed in
  getPatients(searchTerm?: string): Observable<IPatient[]> {
    const patients$ = collectionData(this.patientsCollection, { idField: 'id' });

    return patients$.pipe(
      map((patients) => {
        let patientList = patients;

        if (searchTerm) {
          patientList = patients.filter((patient) =>
            this.matchesSearchTerm(patient, searchTerm)
          );
        }

        return patientList.map(patient => {
          return {
            ...patient,
            dateOfBirth: patient['dateOfBirth'].toDate()
          } as IPatient;

        });
      })
    );
  }

  // POST new patient
  addPatient(patient: IPatient): Promise<void> {
    const newDocRef = doc(this.patientsCollection);
    return setDoc(newDocRef, patient);
  }

  // PUT update patient
  updatePatient(patient: Partial<IPatient>): Promise<void> {
    const patientDocRef = doc(this.firestore, `${PATIENT_COLLECTION}/${patient.id}`);
    return updateDoc(patientDocRef, patient);
  }

  private matchesSearchTerm(patient: any, searchTerm: string): boolean {
    if (!searchTerm) {
      return true;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return Object.values(patient).some(value =>
      value.toString().toLowerCase().includes(lowerSearchTerm)
    );
  }
}
