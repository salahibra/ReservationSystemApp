import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formGroup!: FormGroup;
  showPassword: boolean = false;

  constructor(private authService: AuthServiceService, private router: Router) { }
  ngOnInit(){
    this.initForm();
  }
  initForm(){
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),

    });
  }
  onRegister(){
    if(this.formGroup.valid){
      this.authService.register(this.formGroup.value).subscribe((res)=>{
        if(!res.success){
          console.log(res.message);
          return;
        }
        if(res.success){
          // store token and user in session storage
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('user', JSON.stringify(res.user));
          // if user is admin
          if(res.user.role == 'admin'){
            // direct to admin page
            this.router.navigate(['/admin']);
          }
          // if user is normal user
          else{
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
