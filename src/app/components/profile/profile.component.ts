import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../service/student.service';
import { User } from '../../user';

@Component({
  selector: 'app-profile',
  standalone: false,

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user = new User;
  constructor( private studentService: StudentService){ }

  ngOnInit(): void {
    this.getUserDetails();
  }
  // get user details
  getUserDetails(){
    this.studentService.getUserDetails().subscribe((data: any) => {
      console.log(data);
      this.user = data.user;
      console.log(this.user);

    });

  }

}
