import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Appointment {
  time: string;
  doctorId: string;
  patientId: string;
  date: string;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointment-list.component.html',
  styleUrls: []
})
export class AppointmentListComponent {
  appointments: any[] = [];
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

  // Fetch all appointments
  getAppointments() {
    this.http.get('http://localhost:8000/api/api/get-appointments/')
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

  // Render appointments in the HTML table
  renderAppointments() {
    const appointmentsTableBody = document.getElementById('appointments-table-body');
    if (appointmentsTableBody) {
      appointmentsTableBody.innerHTML = ''; // Clear existing entries
      this.appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td style="border: 1px solid #ccc; padding: 10px;">${appointment.time}</td>
          <td style="border: 1px solid #ccc; padding: 10px;">${appointment.doctor_id}</td>
          <td style="border: 1px solid #ccc; padding: 10px;">${appointment.patient_id}</td>
          <td style="border: 1px solid #ccc; padding: 10px;">${appointment.date}</td>
          <td style="border: 1px solid #ccc; padding: 10px;">
            <button style="background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer;"
                    onclick="confirmDelete(${appointment.id})">Delete</button>
          </td>
        `;
        appointmentsTableBody.appendChild(row);
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
      doctor_id: this.newAppointment.doctorId,
      patient_id: this.newAppointment.patientId,
      date: this.newAppointment.date,
      time: this.newAppointment.time
    };

    // Post request to create an appointment
    this.http.post('http://localhost:8000/api/api/create-appointment/', appointmentData)
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
    this.http.delete(`http://localhost:8000/api/api/delete-appointment/${appointmentId}/`)
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
