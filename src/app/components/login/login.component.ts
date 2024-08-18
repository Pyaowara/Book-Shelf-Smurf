import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service'
import { RouterModule }from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

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

export class LoginComponent implements OnInit{
  loginMessage: string = '';

  users: UserData = {
    user_name: '',
    user_pass: ''
  };

  async ngOnInit(){
    let token = this.cookieService.get('userToken');
    if(token.length > 0){
      let res = await this.authService.validateToken(token)
      if(res?.valid == true){
        this.router.navigate(['booklist/'+res.name])
      }
    }
  }

  constructor(private authService: AuthService,
              private cookieService: CookieService,
              private router: Router
  ) { }
  
  login() {
    this.authService.login(this.users).subscribe(
      (message: string) => {
        this.loginMessage = message;
      }
    );
  }
}

