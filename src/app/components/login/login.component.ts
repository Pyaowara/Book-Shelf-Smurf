import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service'
import { RouterModule }from '@angular/router';
import { lastValueFrom } from 'rxjs';


interface UserData {
  user_name: string;
  user_pass: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent{
  loginMessage: string = '';

  users: UserData = {
    user_name: '',
    user_pass: ''
  };

  constructor(private authService: AuthService
  ) { }
  
  async login() {
    try {
      const message: string = await lastValueFrom(this.authService.login(this.users));
      this.loginMessage = message;
      if(this.loginMessage == "Login successful"){
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.loginMessage = 'Login failed. Please try again.';
    }
  }
}

