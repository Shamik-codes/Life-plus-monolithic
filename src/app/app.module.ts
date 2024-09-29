import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // If you are using forms
import { HttpClientModule } from '@angular/common/http'; // If you are using HttpClient
// import { AppointmentListComponent } from './appointment-list.component'; // Import your component

@NgModule({
  declarations: [
    AppointmentListComponent // Declare your component here
  ],
  imports: [
    CommonModule, // Include CommonModule here
    FormsModule, // Include FormsModule if using forms
    HttpClientModule // Include HttpClientModule if making HTTP calls
  ],
  exports: [AppointmentListComponent] // Optional: Export if needed in other modules
})
export class AppointmentModule { } // Change to your module name




import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';