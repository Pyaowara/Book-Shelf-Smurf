import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';

interface User {
  user_email: string;
  user_name: string;
  user_pass: string;
  user_phone: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  registerMessage: string = '';
  users : User= {
    user_email: '',
    user_name: '',
    user_pass: '',
    user_phone: ''
  };
  confirm_pass:string = '';

  constructor(private authService: AuthService,
              private router: Router){}
  register(){
    if(this.users.user_pass != this.confirm_pass){
      this.registerMessage = 'Password and confirm password do not match.';
    }
    else{
      this.authService.register(this.users).subscribe(
        (message: string) => {
          this.registerMessage = message;
        }
      );
    }
  }

  login(){
    this.router.navigate(['login']);
  }
}
