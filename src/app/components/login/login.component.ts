import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  showPassword: boolean = false;


  constructor(private authService: AuthServiceService,
     private router: Router) { }
  ngOnInit(){
    this.initForm();
   }
  initForm(){
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
  onLogin(){
    if(this.formGroup.valid){
      this.authService.login(this.formGroup.value).subscribe(
          (res) => {
           if(!res.success){
            // if login is not show that this email is not registered in the form
            console.log(res.message);
            return;
          }
          if(res.success){
            // store token and user in session storage
            sessionStorage.setItem('token', res.token);
            sessionStorage.setItem('user', JSON.stringify(res.user));
            console.log(sessionStorage.getItem('user'));
            // if user is admin
            if(res.user.role === 'admin'){
              // direct to admin page
              this.router.navigate(['/admin']);
            } else {
              // direct to home page
              this.router.navigate(['/home']);
            }
          }
      });
    }
  }
  togglePassword(){
    this.showPassword = !this.showPassword;
  }
}
