import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../reservation';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }
  // get the reservations by user id using a token stored in local storage
  getReservations(id: number){
    return this.http.get(`http://localhost:8000/api/student/${id}/reservations`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // add a reservation
  addReservation(data: Reservation){
    return this.http.post('http://localhost:8000/api/student/reservation', data, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // get pcs availables
  getPcs(date: any, timeSlot: any): Observable<any>{

    return this.http.get(`http://localhost:8000/api/student/available-pcs/${date}/${timeSlot}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // get the reservation by id
  getReservation(id: number){
    return this.http.get(`http://localhost:8000/api/student/reservation/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // update a reservation
  updateReservation(id: number, data: Reservation){
    return this.http.put(`http://localhost:8000/api/student/reservation/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // delete a reservation
  deleteReservation(id: number){
    return this.http.delete(`http://localhost:8000/api/student/reservation/${id}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // generate a qr code for a reservation with pdf format
  generateQrCode(id: number) {
    return this.http.get(`http://localhost:8000/api/student/reservation/${id}/qr-code`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    }).pipe(
      map((response: any) => {
        return response.qrCode;
      })
    );
  }
  // get userDetails
  getUserDetails(){
    return this.http.get('http://localhost:8000/api/student/userDetails', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // get time slots availables for a date
  getTimeSlotsAvailables(date: any){
    return this.http.get(`http://localhost:8000/api/student/${JSON.parse(sessionStorage.getItem('user') || '{}').id}/time-slots/${date}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
}
