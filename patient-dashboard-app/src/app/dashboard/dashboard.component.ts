import { Component, OnInit } from '@angular/core';
import { IPatient, STATUS } from '../models/patient.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

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
      dateOfBirth: new Date('1994/04/23'),
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
        'Patient likes cats',
        'Patient eats only food that are soft, green, and have the scent of fresh rain'
      ]
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1994/06/28'),
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
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1992-08-25'),
      status: STATUS.ACTIVE,
      addresses: [
        {
          street: '101 Pine Ave',
          city: 'Riverside',
          state: 'CA',
          zip: '92501'
        }
      ],
      additionalInfo: [
        'Allergic to peanuts'
      ]
    },
    {
      firstName: 'David',
      lastName: 'Lee',
      dateOfBirth: new Date('1988-04-12'),
      status: STATUS.INQUIRY,
      addresses: [
        {
          street: '789 Maple Dr',
          city: 'Hill Valley',
          state: 'CA',
          zip: '91501'
        }
      ],
      additionalInfo: [
        'Prefers evening appointments'
      ]
    },
    {
      firstName: 'Anna',
      middleName: 'C.',
      lastName: 'Garcia',
      dateOfBirth: new Date('1995-11-30'),
      status: STATUS.ONBOARDING,
      addresses: [
        {
          street: '555 Oak Ave',
          city: 'Bay City',
          state: 'CA',
          zip: '93001'
        }
      ]
    },
    {
      firstName: 'Daniel',
      lastName: 'Martinez',
      dateOfBirth: new Date('1983-02-18'),
      status: STATUS.CHURNED,
      addresses: [
        {
          street: '987 Pine Ln',
          city: 'Oceanview',
          state: 'CA',
          zip: '94001'
        }
      ],
      additionalInfo: [
        'History of heart disease'
      ]
    },
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
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1992-08-25'),
      status: STATUS.ACTIVE,
      addresses: [
        {
          street: '101 Pine Ave',
          city: 'Riverside',
          state: 'CA',
          zip: '92501'
        }
      ],
      additionalInfo: [
        'Allergic to peanuts'
      ]
    },
    {
      firstName: 'David',
      lastName: 'Lee',
      dateOfBirth: new Date('1988-04-12'),
      status: STATUS.INQUIRY,
      addresses: [
        {
          street: '789 Maple Dr',
          city: 'Hill Valley',
          state: 'CA',
          zip: '91501'
        }
      ],
      additionalInfo: [
        'Prefers evening appointments'
      ]
    },
    {
      firstName: 'Anna',
      middleName: 'C.',
      lastName: 'Garcia',
      dateOfBirth: new Date('1995-11-30'),
      status: STATUS.ONBOARDING,
      addresses: [
        {
          street: '555 Oak Ave',
          city: 'Bay City',
          state: 'CA',
          zip: '93001'
        }
      ]
    },
  ];

  patientList: IPatient[] = [];
  selectedPatient: IPatient;
  patientToUpdate: IPatient = null;

  filterFormGroup: FormGroup;

  displayedColumns: string[] = ['firstName', 'dateOfBirth', 'status'];
  showPatientForm: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.patientList = this.testPatients;
    this.selectedPatient = this.patientList[0];

    this.filterFormGroup = this.formBuilder.group({
      searchFilter: new FormControl('')
    });

    this.filterFormGroup.get('searchFilter').valueChanges.pipe(
      debounceTime(250)
    ).subscribe((searchStr: string) => {
      console.log(searchStr)
    });
  }

  openPatientForm(patientToUpdate?: IPatient) {
    this.showPatientForm = true;
    // Handle opening form in either add new mode or edit mode depending on if param is passed in or not
  }

  closePatientForm(): void {
    this.showPatientForm = false;
    this.patientToUpdate = null;
  }

  onRowClicked(patient: IPatient): void {
    this.selectedPatient = patient;
  }

  editPatientRecord(): void {
    this.patientToUpdate = this.selectedPatient;
    this.showPatientForm = true;
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Check if the current month is before the birth month or if it's the birth month but the current day is before the birth day
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
