import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user_service/user.service';
import { UserProfileResponse } from '../../../services/user_service/user.respones.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repassword.component.html',
  styleUrl: './repassword.component.scss'
})
export class RepasswordComponent implements OnInit{
  public newPassword:string = '';
  public confrimePass:string = '';
  public userData:UserProfileResponse|null = null;
  public message:string|undefined = '';
  public confrimeNewPassword:string = '';

  constructor(private userService: UserService,
              private cookieService: CookieService,
              private router:Router
  ){};

  async ngOnInit(){
      await this.loadData();
  }

  async update(){
    if(this.newPassword == this.confrimeNewPassword){
      try{
        let res = await this.userService.changePassword(this.userData!.user_id, this.newPassword, this.confrimePass);
        await this.cookieService.set('userToken', res!.userToken, 30, '/');
        this.message =  await res?.message;
      }
      catch(err:any){
        console.log('Error:', err);
        this.message = err.message;
      }
    }
    else{
      this.message = 'Invalid confrime new password';
    }
    
    
  }

  async loadData(){
    this.userData = await this.userService.getData();
  }
}
