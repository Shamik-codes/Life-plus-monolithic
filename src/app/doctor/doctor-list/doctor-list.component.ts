import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Doctor, DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss'
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];  // Array to hold doctor data

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    // Fetch the list of doctors when the component is initialized
    this.doctorService.getDoctors().subscribe((data: Doctor[]) => {
      this.doctors = data;  // Bind the retrieved data to the doctors array
    });
  }
}