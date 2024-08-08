import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

interface User {
  user_email: string;
  user_name: string;
  user_pass: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerMessage: string = '';
  users : User= {
    user_email: '',
    user_name: '',
    user_pass: '',
  };

  constructor(private authService: AuthService){}
  register(){
    this.authService.register(this.users).subscribe(
      (message: string) => {
        this.registerMessage = message;
      }
    );
  }
}
