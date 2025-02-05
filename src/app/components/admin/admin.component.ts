import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { StudentService } from '../../service/student.service';

@Component({
  selector: 'app-admin',
  standalone: false,

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  // all reservations
  reservations: any = [];
  // all users
  users: any = [];
  constructor(private adminService: AdminService, private studentService: StudentService) { }
  ngOnInit(){
    // get all reservations
    this.getReservations();
    // get all users
    this.getUsers();

  }
  getReservations(){
    // get all reservations
    this.adminService.getReservations().subscribe((res)=>{
      this.reservations = res;
    });
  }
  // get all users
  getUsers(){
    this.adminService.getUsers().subscribe((res:any)=>{
      this.users = res.users;
    // fill number of reservations for each student
    this.fillNumberOfReservations();
    });
  }
  // get all reservations for a user by id
  getReservationsByUser(id: number){
    this.studentService.getReservations(id).subscribe((res)=>{
      this.reservations = res;
    });
  }
  // get student by reservation id
  getStudentByReservationId(id: number) {
    this.adminService.getStudentByReservation(id).subscribe((res: any) => {
      const div = document.createElement('div');

      // Modern styling
      div.style.cssText = `
        position: fixed;
        z-index: 1000;
        width: 320px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
        transition: all 0.3s ease-in-out;
        font-family: Arial, sans-serif;
      `;

      // Create content with better structure
      const content = `
        <h3 style="margin: 0 0 12px; color: #333;">Student Details</h3>
        <p style="margin: 8px 0; color: #666;">
          <strong>Name:</strong> ${res.name}
        </p>
        <p style="margin: 8px 0; color: #666;">
          <strong>Email:</strong> ${res.email}
        </p>
        <button style="
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #666;
        ">×</button>
      `;

      div.innerHTML = content;
      document.body.appendChild(div);

      // Trigger animation
      requestAnimationFrame(() => {
        div.style.transform = 'translate(-50%, -50%) scale(1)';
        div.style.opacity = '1';
      });

      // Add close button functionality
      const closeBtn = div.querySelector('button');
      closeBtn?.addEventListener('click', () => closeModal());

      // Close function with animation
      const closeModal = () => {
        div.style.transform = 'translate(-50%, -50%) scale(0.5)';
        div.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(div)) {
            document.body.removeChild(div);
          }
        }, 300);
      };

      // Auto close after 5 seconds
      setTimeout(closeModal, 5000);
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

  numberOfReservations: { [key: number]: number } = {};
  fillNumberOfReservations() {
    this.users.forEach((user: any) =>
      this.getNumberOfReservationsByStudentId(user.id)
    );

  }
  getNumberOfReservationsByStudentId(id: number) {
    this.adminService.getNumberOfReservationsByStudentId(id).subscribe((res: any) => {
      this.numberOfReservations[id] = res.numberOfReservations;
    });
  }

}
