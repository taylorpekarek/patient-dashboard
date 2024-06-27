import { Component, OnInit } from '@angular/core';
import { IPatient, STATUS } from '../models/patient.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  testPatients: IPatient[] = [
    {
      firstName: 'John',
      middleName: 'A.',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      status: STATUS.ACTIVE,
      addresses: [
        {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701'
        }
      ],
      additionalInfo: [
        'Patient requires special diet',
        'Patient likes cats'
      ]
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1985-05-15'),
      status: STATUS.INQUIRY,
      addresses: [
        {
          street: '456 Oak St',
          city: 'Metropolis',
          state: 'NY',
          zip: '10001'
        },
        {
          street: '789 Pine St',
          city: 'Gotham',
          state: 'NY',
          zip: '10002'
        }
      ],
      additionalInfo: [
        '555-1234'
      ]
    },
    {
      firstName: 'Emily',
      middleName: 'B.',
      lastName: 'Jones',
      dateOfBirth: new Date('1975-07-20'),
      status: STATUS.ONBOARDING,
      addresses: [
        {
          street: '321 Elm St',
          city: 'Smallville',
          state: 'KS',
          zip: '66002'
        }
      ]
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      dateOfBirth: new Date('2000-12-10'),
      status: STATUS.CHURNED,
      addresses: [
        {
          street: '654 Cedar St',
          city: 'Star City',
          state: 'CA',
          zip: '90210'
        }
      ],
      additionalInfo: [
        'previousVisits: 3'
      ]
    }
  ];

  patientList: IPatient[] = [];
  selectedPatient: IPatient;

  displayedColumns: string[] = ['firstName', 'dateOfBirth', 'status'];
  showPatientForm: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.patientList = this.testPatients;
  }

  openPatientForm(patientToUpdate?: IPatient) {
    this.showPatientForm = true;
    // Handle opening form in either add new mode or edit mode depending on if param is passed in or not
  }

  closePatientForm(): void {
    this.showPatientForm = false;
  }

  onRowClicked(patient: IPatient): void {
    this.selectedPatient = patient;
  }
}
