import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../service/student.service';
import { Reservation } from '../../reservation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-reservation',
  standalone: false,

  templateUrl: './add-reservation.component.html',
  styleUrl: './add-reservation.component.css'
})
export class AddReservationComponent implements OnInit {
  // variable to store the reservation: date, timeSlot, pcId
  reservation = new Reservation;
  // variable to store pcs availables
  pcs: any;
  data: any;
  timeSlots: any;
  today: string = new Date().toISOString().split('T')[0];
  //maxDate is today plus 7 days
  maxDate: string = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
  constructor(private studentService: StudentService, private route: Router) { }

  ngOnInit(){
    // get pcs availables
    this.getPcs(this.reservation.dateReservation, this.reservation.timeSlot);

  }
  // get pcs availables
  getPcs(date: any, timeSlot: any){
    // get pcs availables
    this.studentService.getPcs(date, timeSlot).subscribe((res)=>{
      this.pcs = res;
      console.log(this.pcs);
    });
  }
  // add a reservation
  addReservation(){
    // get user id from local storage
    let user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.reservation.user_id = user.id;
    this.data = this.reservation;
    // add a reservation
    this.studentService.addReservation(this.data).subscribe((res)=>{
      // redirect to home page
      this.route.navigate(['home']);
      console.log(res);
    });
  }

  // get the time slots availables for the selected date
  getTimeSlots(dateReservation: any){
    this.studentService.getTimeSlotsAvailables(dateReservation).subscribe((res)=>{
      this.timeSlots = res;
      console.log(this.timeSlots);
    });
  }


}
