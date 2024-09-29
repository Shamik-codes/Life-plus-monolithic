import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PatientListComponent } from './patient/patient-list/patient-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PatientListComponent, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // Corrected `styleUrls` instead of `styleUrl`
})
export class AppComponent {
  title = 'life-plus';
}
