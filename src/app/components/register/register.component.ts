import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from '../../services/register-service/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerMessage: string = '';
  users = {
    users_email: '',
    users_username: '',
    users_password: '',
  };

  constructor(private registerService: RegisterService){}
  register(){
    this.registerService.register(this.users).subscribe(
      (message: string) => {
        this.registerMessage = message;
      }
    );
  }
}
