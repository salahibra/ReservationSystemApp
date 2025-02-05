import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor( private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/login', data);
  }
  register(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/register', data);
  }
}
