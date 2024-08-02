import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login-service/login.service';
import { RouterModule }from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginMessage: string = '';
  users = {
    users_username: '',
    users_password: ''
  };

  constructor(private loginService: LoginService,
  ) { }
  
  login() {
    this.loginService.login(this.users).subscribe(
      (message: string) => {
        this.loginMessage = message;
      }
    );
  }
}

