import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PatientService } from '../service/patient.service';
import { DashboardComponent } from './dashboard.component';
import { IPatient, STATUS } from '../models/patient.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;

  const mockPatients: IPatient[] = [
    {
      id: '1',
      firstName: 'John',
      middleName: 'A',
      lastName: 'Doe',
      dateOfBirth: new Date('1990/01/01'),
      status: STATUS.ACTIVE,
      addresses: [{ street: '123 Main St', city: 'Anytown', state: 'NY', zip: '12345' }],
      additionalInfo: ['Info 1', 'Info 2']
    },
    {
      id: '2',
      firstName: 'Jane',
      middleName: 'B',
      lastName: 'Smith',
      dateOfBirth: new Date('1985/05/15'),
      status: STATUS.CHURNED,
      addresses: [{ street: '456 Elm St', city: 'Othertown', state: 'CA', zip: '67890' }],
      additionalInfo: ['Info 3', 'Info 4']
    }
  ];

  beforeEach(waitForAsync (() => {
    const patientService = jasmine.createSpyObj('PatientService', ['getPatients']);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatTableModule,
        MatCardModule
      ],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: patientService }
      ]
    }).compileComponents();

    patientServiceSpy = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with patient list and selected patient', () => {
    patientServiceSpy.getPatients.and.returnValue(of(mockPatients));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.patientList).toEqual(mockPatients);
    expect(component.selectedPatient).toEqual(mockPatients[0]);
  });

  it('should open patient form', () => {
    component.openPatientForm();
    expect(component.showPatientForm).toBeTrue();
  });

  it('should close patient form', () => {
    component.closePatientForm();
    expect(component.showPatientForm).toBeFalse();
    expect(component.patientToUpdate).toBeNull();
  });

  it('should select a patient when a row is clicked', () => {
    const patient = mockPatients[1];
    component.onRowClicked(patient);
    expect(component.selectedPatient).toEqual(patient);
  });

  it('should set patient to update and show form when editing a patient', () => {
    component.selectedPatient = mockPatients[0];
    component.editPatientRecord();
    expect(component.patientToUpdate).toEqual(mockPatients[0]);
    expect(component.showPatientForm).toBeTrue();
  });

  it('should calculate age correctly', () => {
    const age = component.calculateAge(new Date('1990-01-01'));
    const today = new Date();
    const expectedAge = today.getFullYear() - 1990 - (today.getMonth() < 0 || (today.getMonth() === 0 && today.getDate() < 1) ? 1 : 0);
    expect(age).toEqual(expectedAge);
  });
});
