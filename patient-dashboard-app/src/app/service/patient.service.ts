import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { IAddress, IPatient } from '../models/patient.model';
import { Observable, Timestamp, combineLatest, map, switchMap } from 'rxjs';

const PATIENT_COLLECTION = 'patient';
const ADDRESS_COLLECTION = 'address';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patientsCollection;

  constructor(private firestore: Firestore) {
    this.patientsCollection = collection(this.firestore, PATIENT_COLLECTION);
  }

  getPatients(): Observable<IPatient[]> {
    const patients = collectionData(this.patientsCollection, { idField: 'id' });// as Observable<IPatient[]>;

    return patients.pipe(
      switchMap(patientData => {
        const patientObservables = patientData.map(patient => {

          const convertedPatient = { ...patient, dateOfBirth: patient['dateOfBirth'].toDate() } as IPatient;

          return this.getPatientAddresses(convertedPatient.id).pipe(
            map(addresses => ({
              ...convertedPatient,
              addresses
            }))
          )
      });

        return combineLatest(patientObservables);
      })
    );
  }

  getPatientAddresses(patientId: string) {
    const addressesCollection = collection(this.patientsCollection, patientId, 'address');
    return collectionData(addressesCollection, { idField: 'id' }) as Observable<IAddress[]>;
  }
}
