import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../service/student.service';
import { Reservation } from '../../reservation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-reservation',
  standalone: false,

  templateUrl: './edit-reservation.component.html',
  styleUrl: './edit-reservation.component.css'
})
export class EditReservationComponent implements OnInit {
  reservation = new Reservation;
  id: any;
  data: any;
  pcs: any;
  timeSlots: any;
  today: string = new Date().toISOString().split('T')[0];
  maxDate: string = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getReservation();
  }
  getReservation(){
    this.studentService.getReservation(this.id).subscribe(
      res => {
      this.data = res;
      this.reservation = this.data;
      this.getPcs();
      this.getTimeSlots(this.reservation.dateReservation);
    });
  }
  updateReservation(){
    this.studentService.updateReservation(this.id, this.reservation).subscribe(
      res => {
        this.getReservation();
        this.router.navigate(['/home']);
    });
  }
  // get the time slots availables for the selected date
  getTimeSlots(dateReservation: any){
    this.studentService.getTimeSlotsAvailables(dateReservation).subscribe((res)=>{
      this.timeSlots = res;
      if(!this.timeSlots.includes(this.reservation.timeSlot)){
        this.timeSlots.push(this.reservation.timeSlot);
      }
    });
  }
   // get available pcs
   getPcs(){
    this.studentService.getPcs(this.reservation.dateReservation, this.reservation.timeSlot).subscribe(
      res => {
        this.pcs = res;
        // add the pc of the reservation to the list of available pcs
        this.pcs.push(this.reservation.pc);
        console.log(this.pcs);
        // drop duplicates
        this.pcs = this.pcs.filter((value: any, index: any, self: any) => self.indexOf(value) === index);
    });
  }
  // map value of the selected slot to label
  getTimeslotLabel(timeSlot: any){
    let label = '';
    switch(timeSlot){
      case '0':
        label = '8:00 - 10:00';
        break;
      case '1':
        label = '10:00 - 12:00';
        break;
      case '2':
        label = '14:00 - 16:00';
        break;
      case '3':
        label = '16:00 - 18:00';
        break;
    }
  }

}


