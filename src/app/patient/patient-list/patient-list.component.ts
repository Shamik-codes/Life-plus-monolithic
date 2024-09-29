import { Component, OnInit } from '@angular/core';
import { Patient, PatientService } from '../patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
  standalone: true,  // Mark the component as standalone
  imports: [CommonModule],  // Add required imports like CommonModule
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    // Fetch the patient list when the component is initialized
    this.patientService.getPatients().subscribe((data: Patient[]) => {
      this.patients = data;
    });
  }
}
