// appointment.model.ts

export interface Appointment {
    id?: number;       // Unique identifier for the appointment (optional if auto-generated)
    time: string;      // Time of the appointment (e.g., "14:00")
    doctorId: number |null;  // ID of the doctor (e.g., 1, 2, etc.)
    patientId: number |null; // ID of the patient (e.g., 1, 2, etc.)
    date: string;      // Date of the appointment in YYYY-MM-DD format (e.g., "2024-09-29")
}
