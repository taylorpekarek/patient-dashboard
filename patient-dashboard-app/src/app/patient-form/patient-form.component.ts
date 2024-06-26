import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPatient, STATUS } from '../models/patient.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  statusEnum = STATUS;
  statusOptions = Object.values(STATUS);

  get addresses() {
    return this.patientForm.get('addresses') as FormArray;
  }

  get additionalFields() {
    return this.patientForm.get('additionalFields') as FormArray;
  }

  constructor(private fb: FormBuilder) {
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

  ngOnInit(): void {}

  createAddress(): FormGroup {
    return this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });
  }

  addAddress(): void {
    this.addresses.push(this.createAddress());
  }

  addAdditionalField(): void {
    this.additionalFields.push(this.fb.control(''));
  }

  onSubmit(): void {
    // Save new patient in DB

    this.resetForm();
  }

  private resetForm(): void {
    this.patientForm.reset();
    this.patientForm.setControl('addresses', this.fb.array([this.createAddress()]));
    this.patientForm.setControl('additionalFields', this.fb.array([]));
  }
}
