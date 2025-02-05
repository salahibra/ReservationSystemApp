import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  // get all reservations using a token stored in local storage
  getReservations(){

    return this.http.get('http://localhost:8000/api/admin/reservations', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // get all users using a token stored in local storage
  getUsers(){
    return this.http.get('http://localhost:8000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // get student by reservation id
  getStudentByReservation(id: number){
    return this.http.get(`http://localhost:8000/api/admin/reservation/${id}/student`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
  // get the number of reservations for a student by id
  getNumberOfReservationsByStudentId(id: number){
    return this.http.get(`http://localhost:8000/api/admin/reservations/student/${id}/count`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
  }
}
