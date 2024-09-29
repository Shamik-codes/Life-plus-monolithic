import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the structure of a doctor record
export interface Doctor {
  id?: number;
  name: string;
  specialty: string;
  experience: number;
  image: string;
}

@Injectable({
  providedIn: 'root'  // Makes the service available throughout the application
})
export class DoctorService {
  // The base URL of the Django API for doctors
  private baseUrl = 'http://127.0.0.1:8000/api/api/doctors/';

  constructor(private http: HttpClient) {}

  // Method to get the list of doctors from the API
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.baseUrl);
  }

  // Method to get a single doctor by ID
  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}${id}/`);
  }

  // Method to add a new doctor to the database
  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.baseUrl, doctor);
  }

  // Method to update an existing doctor
  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}${id}/`, doctor);
  }

  // Method to delete a doctor from the database
  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
