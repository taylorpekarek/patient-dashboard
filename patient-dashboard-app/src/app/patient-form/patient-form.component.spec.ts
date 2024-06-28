import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PatientService } from '../service/patient.service';
import { PatientFormComponent } from './patient-form.component';
import { IPatient, STATUS } from '../models/patient.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

describe('PatientFormComponent', () => {
  let component: PatientFormComponent;
  let fixture: ComponentFixture<PatientFormComponent>;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;

  const mockPatient: IPatient = {
    id: '1',
    firstName: 'John',
    middleName: 'A',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    status: STATUS.ACTIVE,
    addresses: [{ street: '123 Main St', city: 'Anytown', state: 'NY', zip: '12345' }],
    additionalInfo: ['Info 1', 'Info 2']
  };

  beforeEach(async () => {
    const patientService = jasmine.createSpyObj('PatientService', ['updatePatient', 'addPatient']);
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [PatientFormComponent],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: patientService },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    patientServiceSpy = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;

    fixture = TestBed.createComponent(PatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.patientForm).toBeDefined();
    expect(component.patientForm.get('firstName')?.value).toBe('');
    expect(component.patientForm.get('middleName')?.value).toBe('');
    expect(component.patientForm.get('lastName')?.value).toBe('');
    expect(component.patientForm.get('dateOfBirth')?.value).toBe('');
    expect(component.patientForm.get('status')?.value).toBe('');
    expect(component.addresses.length).toBe(1);
    expect(component.additionalFields.length).toBe(0);
  });

  it('should populate the form when updatePatient input changes', () => {
    component.updatePatient = mockPatient;
    component.ngOnChanges({
      updatePatient: {
        currentValue: mockPatient,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.patientForm.get('firstName')?.value).toBe(mockPatient.firstName);
    expect(component.patientForm.get('middleName')?.value).toBe(mockPatient.middleName);
    expect(component.patientForm.get('lastName')?.value).toBe(mockPatient.lastName);
    expect(component.patientForm.get('dateOfBirth')?.value).toEqual(mockPatient.dateOfBirth);
    expect(component.patientForm.get('status')?.value).toBe(mockPatient.status);
    expect(component.addresses.length).toBe(mockPatient.addresses.length);
    expect(component.additionalFields.length).toBe(mockPatient.additionalInfo.length);
  });

  it('should add a new address to the form array', () => {
    component.addAddress();
    expect(component.addresses.length).toBe(2);
  });

  it('should add a new additional field to the form array', () => {
    component.addAdditionalField();
    expect(component.additionalFields.length).toBe(1);
  });

  it('should show an error if form is invalid when saving', () => {
    component.patientForm.patchValue({ firstName: '', lastName: '', dateOfBirth: '', status: '' });
    component.savePatientRecord();

    expect(component.hasFormError).toBe(true);
    expect(patientServiceSpy.addPatient).not.toHaveBeenCalled();
    expect(patientServiceSpy.updatePatient).not.toHaveBeenCalled();
  });

  it('should emit closeForm event when closePatientForm is called', () => {
    spyOn(component.closeForm, 'emit');
    component.closePatientForm();
    expect(component.closeForm.emit).toHaveBeenCalledWith(true);
  });
});
