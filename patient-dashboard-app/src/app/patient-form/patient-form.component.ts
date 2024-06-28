import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddress, IPatient, STATUS } from '../models/patient.model';
import { US_STATES } from '../models/us-state.model';
import { PatientService } from '../service/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnChanges {
  @Input() updatePatient: IPatient;
  @Output() closeForm = new EventEmitter<boolean>();

  patientForm: FormGroup;

  statusOptions = Object.values(STATUS);
  stateOptions = Object.values(US_STATES);

  isEditingPatient: boolean = false;
  hasFormError: boolean = false;

  get addresses() {
    return this.patientForm.get('addresses') as FormArray;
  }

  get additionalFields() {
    return this.patientForm.get('additionalFields') as FormArray;
  }

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      status: ['', Validators.required],
      addresses: this.fb.array([this.createAddress()]),
      additionalFields: this.fb.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const updatePatientChange = changes['updatePatient'];

    if (updatePatientChange) {
      const editPatientData = updatePatientChange?.currentValue as IPatient;

      if (editPatientData) {
        this.isEditingPatient = true;
        this.populateForm();
      } else {
        this.isEditingPatient = false;
      }
    }
  }

  // Fills form in with patient data the user intends to update
  populateForm() {
    this.patientForm.patchValue({
      firstName: this.updatePatient.firstName,
      middleName: this.updatePatient.middleName,
      lastName: this.updatePatient.lastName,
      dateOfBirth: this.updatePatient.dateOfBirth,
      status: this.updatePatient.status
    });

    this.addresses.clear();
    this.updatePatient.addresses.forEach(address => {
      this.addresses.push(this.createAddress(address));
    });

    this.additionalFields.clear();
    this.updatePatient.additionalInfo.forEach(info => {
      this.additionalFields.push(this.fb.control(info));
    });
  }

  // Creates the address FormGroup that is part of a formArray
  // If an address is passed in, then it populates the form with that data
  createAddress(newAddress?: IAddress): FormGroup {
    if (newAddress) {
      return this.fb.group({
        street: [newAddress.street, Validators.required],
        city: [newAddress.city, Validators.required],
        state: [newAddress.state, Validators.required],
        zip: [newAddress.zip, Validators.required]
      });
    } else {
      return this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      });
    }
  }

  // Adds another address FormGroup to the addresses FormArray
  addAddress(): void {
    this.addresses.push(this.createAddress());
  }

  // Adds another additional info field FormGroup to the additionalFields FormArray
  addAdditionalField(): void {
    this.additionalFields.push(this.fb.control(''));
  }

  // If not in editing mode a new patient record is saved
  // If in editing mode an existing patient record is updtaed
  savePatientRecord(): void {
    this.hasFormError = false;

    if (this.patientForm.invalid) {
      this.hasFormError = true;
      return;
    }

    const patientObj: IPatient = this.buildPatientObj();

    if (this.isEditingPatient) {
      patientObj.id = this.updatePatient.id;
      this.patientService.updatePatient(patientObj).then(() => {
        this.snackBar.open('Patient updated successfully!', 'Close', {
          verticalPosition: 'top',
          duration: 5000
        });
        this.closePatientForm();
      }).catch(() => {
        this.snackBar.open('Patient update failed', 'Close', {
          verticalPosition: 'top'
        });
      });
    } else {
      this.patientService.addPatient(patientObj).then(() => {
        this.snackBar.open('New patient added successfully!', 'Close', {
          verticalPosition: 'top',
          duration: 5000
        });
        this.closePatientForm();
      }).catch(() => {
        this.snackBar.open('New patient save failed', 'Close', {
          verticalPosition: 'top'
        });
      });
    }
  }

  // Communicates back to the parent component to closed the patient form
  closePatientForm() : void {
    this.closeForm.emit(true);
  }

  // Take all the data from the FormGroup and creates an object than can be saved
  private buildPatientObj(): IPatient {
    const formValue = this.patientForm.value;

    const addresses: IAddress[] = formValue.addresses.map((address: IAddress) => ({
      ...address
    }));

    const additionalInfo: string[] = formValue.additionalFields;

    return {
      firstName: formValue.firstName,
      middleName: formValue.middleName,
      lastName: formValue.lastName,
      dateOfBirth: new Date(formValue.dateOfBirth),
      status: formValue.status,
      addresses: addresses,
      additionalInfo: additionalInfo
    };
  }
}
