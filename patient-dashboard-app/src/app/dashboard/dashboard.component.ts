import { Component, OnInit } from '@angular/core';
import { IPatient } from '../models/patient.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showPatientForm: boolean = false;

  constructor() {}

  ngOnInit(): void {
      // fetch data here
  }

  openPatientForm(patientToUpdate?: IPatient) {
    this.showPatientForm = true;
    // Handle opening form in either add new mode or edit mode depending on if param is passed in or not
  }
}
