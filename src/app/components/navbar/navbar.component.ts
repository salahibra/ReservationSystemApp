import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }

  onLogout() {
    console.log('i am here');
    // remove token and user from session storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
