import { Component } from '@angular/core';
import { StudentService } from '../../service/student.service';
import  jsPDF from 'jspdf';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // get user from local storage
  user = JSON.parse(sessionStorage.getItem('user') || '{}');
  // reservations by user id
  reservations: any = [];
  constructor(private studentService: StudentService) { }
  ngOnInit(){
    // get reservations by user id
    this.getReservations();

  }
  getReservations(){
    // get user id from local storage
    // get reservations by user id
    this.studentService.getReservations(this.user.id).subscribe((res)=>{
      this.reservations = res;
    });
  }
  // cancel reservation
  cancelReservation(id: number) {
    // Create a custom confirmation dialog
    const dialogDiv = document.createElement('div');
    dialogDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
    `;

    dialogDiv.innerHTML = `
      <h3 style="margin: 0 0 15px; color: #333;">Confirm Cancellation</h3>
      <p style="margin: 0 0 20px; color: #666;">Are you sure you want to cancel this reservation?</p>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button id="cancelBtn" style="padding: 8px 15px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button id="confirmBtn" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirm</button>
      </div>
    `;

    document.body.appendChild(dialogDiv);

    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    `;
    document.body.appendChild(backdrop);

    // Handle button clicks
    const cleanup = () => {
      document.body.removeChild(dialogDiv);
      document.body.removeChild(backdrop);
    };

    dialogDiv.querySelector('#cancelBtn')?.addEventListener('click', cleanup);
    dialogDiv.querySelector('#confirmBtn')?.addEventListener('click', () => {
      this.studentService.deleteReservation(id).subscribe(() => {
        this.getReservations();
        cleanup();
      });
    });
  }
  // download the qr code for a reservation with pdf format
  downloadQrCode(id: number) {
    this.studentService.generateQrCode(id).subscribe((qrCodeBase64: string) => {
      // Create a PDF document
      const doc = new jsPDF();

      // Convert base64 to image for PDF
      const img = new Image();
      img.src = `data:image/png;base64,${qrCodeBase64}`;

      img.onload = () => {
        // Add header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Reservation QR Code', 20, 20);

        // Add QR code image
        doc.addImage(img, 'PNG', 20, 30, 100, 100);

        // Add footer with date
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 150);

        // Save PDF
        doc.save(`reservation-${id}-qr-code.pdf`);
      };
    });
  }
  private originalReservations: any[] = [];

  // sort reservations by date

  sortReservations(event: any) {

    const value = event.target.value;

    if (value === 'date_asc') {

      this.reservations = this.reservations.sort((a: any, b: any) => new Date(a.dateReservation).getTime() - new Date(b.dateReservation).getTime());

    } else if (value === 'date_desc') {

      this.reservations = this.reservations.sort((a: any, b: any) => new Date(b.dateReservation).getTime() - new Date(a.dateReservation).getTime());

    } else if (value === 'time_slot_asc') {

      this.reservations = this.reservations.sort((a: any, b: any) => a.timeSlot - b.timeSlot);

    }else if (value === 'time_slot_desc') {

      this.reservations = this.reservations.sort((a: any, b: any) => b.timeSlot - a.timeSlot);

    }
     else if (value === 'pc_asc') {

      this.reservations = this.reservations.sort((a: any, b: any) => a.pc.localeCompare(b.pc));

    }else if (value === 'pc_desc') {

      this.reservations = this.reservations.sort((a: any, b: any) => b.pc.localeCompare(a.pc));

    }

  }
  // search reservation by date
  searchReservationByDate(event: any) {

    const value = event.target.value;

    if (value) {

      this.reservations = this.reservations.filter((reservation: any) => reservation.dateReservation.includes(value));

    } else {

      this.getReservations();

    }
  }
  // search reservation by pc each pc column is a string like 'PC1', 'PC2', 'PC3'
  searchReservationByPc(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();

    if (value && this.reservations) {
      this.reservations = this.reservations.filter((reservation: any) =>
        reservation.pc && reservation.pc.toLowerCase() === ('PC' + value).toLowerCase()
      );
    } else {
      this.getReservations();
    }
  }


  // search reservation by time slot
  searchReservationByTimeSlot(event: any) {
    const value = event.target.value;

    if (!this.originalReservations.length) {
      this.originalReservations = [...this.reservations];
    }

    if (value) {
      this.reservations = this.originalReservations.filter((reservation: any) => reservation.timeSlot == value);
    } else {
      this.reservations = [...this.originalReservations];
    }
  }




}
