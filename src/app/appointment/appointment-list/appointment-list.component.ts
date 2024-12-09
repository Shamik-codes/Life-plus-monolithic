import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Doctor {
  id: number;
  name: string;
}

interface Appointment {
  time: string;
  doctorId: string;
  doctorName?: string; 
  patientId: string;
  date: string;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointment-list.component.html',
  styleUrls: []
})
export class AppointmentListComponent implements OnInit{
  appointments: any[] = [];
  doctors: any[] = [];
  showCreateAppointmentForm = false;

  newAppointment: Appointment = {
    time: '',
    doctorId: '',
    patientId: '',
    date: ''
  };

  constructor(private http: HttpClient) {
    this.getAppointments(); // Load appointments on component initialization
  }

  ngOnInit(): void {
    this.fetchAppointments(); // Call fetchAppointments() here to fetch data when the component is loaded
  }
  
  // Fetch all appointments
  getAppointments() {
    this.http.get('http://localhost:8000/api/appointments/')
      .pipe(
        catchError((error) => {
          console.error('Error fetching appointments:', error);
          return of([]); // Return an empty array on error
        })
      )
      .subscribe((response: any) => {
        this.appointments = response;
        this.renderAppointments(); // Render appointments on the table
      });
  }

  fetchDoctors(): Promise<Doctor[]> {
    return fetch('http://localhost:8000/api/doctors') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        return response.json() as Promise<Doctor[]>;
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        return []; // Return an empty array in case of error
      });
  }

  // Fetch the list of appointments and map doctor names
  fetchAppointments(): void {
    // First fetch the list of doctors
    this.fetchDoctors().then((doctors: Doctor[]) => {
      this.doctors = doctors;

      fetch('http://localhost:8000/api/appointments')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch appointments');
          }
          return response.json() as Promise<Appointment[]>;
        })
        .then((appointments: Appointment[]) => {
          // Map doctor names to each appointment
          this.appointments = appointments.map(appointment => {
            const doctor = this.doctors.find(doc => doc.id === appointment.doctorId);
            return {
              ...appointment,
              doctorName: doctor ? doctor.name : 'Unknown Doctor'
            };
          });

          // Now render the appointments
          this.renderAppointments();
        })
        .catch(error => {
          console.error('Error fetching appointments:', error);
        });
    });
  }

  // Render appointments in the HTML table
  renderAppointments() {
    const appointmentsTableBody = document.getElementById('appointments-table-body');
    if (appointmentsTableBody) {
      appointmentsTableBody.innerHTML = ''; // Clear existing entries
      this.appointments.forEach((appointment, index: number) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${appointment.time}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${appointment.doctor}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${appointment.patient}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${appointment.date}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">
            <button id="delete-button-${index}" style="background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 10px; font-size: 1rem;">
              Delete
            </button>
          </td>
        `;
        appointmentsTableBody.appendChild(row);
  
        // Attach event listener to the button dynamically
        const deleteButton = document.getElementById(`delete-button-${index}`);
        if (deleteButton) {
          deleteButton.addEventListener('click', () => this.confirmDelete(appointment.id));
        }
      });
    }
  }

  // Show form to create a new appointment
  openCreateAppointmentForm() {
    this.showCreateAppointmentForm = true;
    this.resetNewAppointment(); // Reset the form fields
    this.updateFormVisibility();
  }

  // Create a new appointment
  createAppointment() {
    const appointmentData = {
      doctor: this.newAppointment.doctorId,
      patient: this.newAppointment.patientId,
      date: this.newAppointment.date,
      time: this.newAppointment.time
    };

    // Post request to create an appointment
    this.http.post('http://localhost:8000/api/appointments/create_appointments/', appointmentData)
      .pipe(
        catchError((error) => {
          console.error('Error creating appointment:', error);
          return of(null); // Return an empty observable on error
        })
      )
      .subscribe((response: any) => {
        if (response) {
          alert('Appointment created successfully!');
          this.getAppointments();  // Refresh the appointments list
          this.resetNewAppointment();
          this.cancelCreateAppointment();  // Close the form
        }
      });
  }

  // Cancel the creation of an appointment
  cancelCreateAppointment() {
    this.showCreateAppointmentForm = false;  // Close the form
    this.updateFormVisibility(); // Update the form visibility in HTML
  }

  // Reset the new appointment data
  resetNewAppointment() {
    this.newAppointment = { time: '', doctorId: '', patientId: '', date: '' };

    // Update the form inputs to match the reset state
    const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
    const doctorInput = document.querySelector('input[placeholder="Enter Doctor ID"]') as HTMLInputElement;
    const patientInput = document.querySelector('input[placeholder="Enter Patient ID"]') as HTMLInputElement;
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;

    if (timeInput) timeInput.value = '';
    if (doctorInput) doctorInput.value = '';
    if (patientInput) patientInput.value = '';
    if (dateInput) dateInput.value = '';
  }

  // Update form visibility in HTML
  updateFormVisibility() {
    const formElement = document.getElementById('create-appointment-form');
    if (formElement) {
      formElement.style.display = this.showCreateAppointmentForm ? 'block' : 'none';
    }
  }

  // Handle input changes
  onInputChange(event: Event, field: keyof Appointment) {
    const inputElement = event.target as HTMLInputElement;
    this.newAppointment[field] = inputElement.value;
  }

  // Confirm deletion
  confirmDelete(appointmentId: number) {
    const confirmed = confirm('Are you sure you want to delete this appointment?');
    if (confirmed) {
      this.deleteAppointment(appointmentId);
    }
  }

  // Delete the selected appointment
  deleteAppointment(appointmentId: number) {
    this.http.delete(`http://localhost:8000/api/appointments/${appointmentId}/`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting appointment:', error);
          return of(null); // Return an empty observable on error
        })
      )
      .subscribe(() => {
        alert('Appointment deleted successfully!');
        this.getAppointments();  // Refresh the appointments list
      });
  }
}