import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddress, IPatient, STATUS } from '../models/patient.model';
import { US_STATES } from '../models/us-state.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit, OnChanges {
  @Input() updatePatient: IPatient;

  patientForm: FormGroup;

  statusOptions = Object.values(STATUS);
  stateOptions = Object.values(US_STATES);

  isEditingPatient: boolean = false;

  get addresses() {
    return this.patientForm.get('addresses') as FormArray;
  }

  get additionalFields() {
    return this.patientForm.get('additionalFields') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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

  addAddress(): void {
    this.addresses.push(this.createAddress());
  }

  addAdditionalField(): void {
    this.additionalFields.push(this.fb.control(''));
  }

  savePatientRecord(): void {
    // Save new patient in DB

    this.resetForm();
  }

  private resetForm(): void {
    this.patientForm.reset();
    this.patientForm.setControl('addresses', this.fb.array([this.createAddress()]));
    this.patientForm.setControl('additionalFields', this.fb.array([]));
  }
}
