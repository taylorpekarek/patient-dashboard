import { Component, OnInit } from '@angular/core';
import { IPatient, STATUS } from '../models/patient.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PatientService } from '../service/patient.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  patientList: IPatient[] = [];
  selectedPatient: IPatient;
  patientToUpdate: IPatient = null;

  filterFormGroup: FormGroup;

  displayedColumns: string[] = ['firstName', 'dateOfBirth', 'status'];
  showPatientForm: boolean = false;

  constructor(
    private patientService: PatientService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.patientService.getPatients().subscribe((resp) => {
      this.patientList = resp;
    })

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
