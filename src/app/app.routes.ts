import { Routes } from '@angular/router';
import { PatientListComponent } from './patient/patient-list/patient-list.component';
import { DoctorListComponent } from './doctor/doctor-list/doctor-list.component';
import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';

export const routes: Routes = [
  { path: 'patients', component: PatientListComponent },
  { path: 'doctors', component: DoctorListComponent },
  { path: 'appointments', component: AppointmentListComponent },
  { path: '', redirectTo: '/patients', pathMatch: 'full' },  // Default route
  { path: '**', redirectTo: '/patients' }  // Wildcard route for 404
];
