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
      this.selectedPatient = this.patientList[0];
    })

    this.filterFormGroup = this.formBuilder.group({
      searchFilter: new FormControl('')
    });

    // Detects when the user is typing in the search bar and updates the table and other UI components
    this.filterFormGroup.get('searchFilter').valueChanges.pipe(
      debounceTime(300)
    ).subscribe((searchStr: string) => {
      this.patientService.getPatients(searchStr).subscribe((resp) => {
        this.patientList = resp;
        this.selectedPatient = this.patientList[0];
      })
    });
  }

  // Opens the patient form to either add a new or edit existing patient
  openPatientForm() {
    this.showPatientForm = true;
  }

  // Closes the patient form and sets the variable storing patients to be edited to null
  closePatientForm(): void {
    this.showPatientForm = false;
    this.patientToUpdate = null;
  }

  // Sets the selected patient to whichever patient record was clicked in the data table
  onRowClicked(patient: IPatient): void {
    this.selectedPatient = patient;
  }

  // Sets the patientToUpdate to whichever patient record is being displayed in the details
  // card and opens the patient form so the user can edit the record
  editPatientRecord(): void {
    this.patientToUpdate = this.selectedPatient;
    this.showPatientForm = true;
  }

  // Helper function to calculate the patients age based on their birth date
  // Though it would be helpful for the provider to quickly see how old the patient is
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
