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
  newPassword:string = '';
  confrimePass:string = '';
  userData:UserProfileResponse|null = null;
  message:string|undefined = '';
  confrimeNewPassword:string = '';
  noti_succes:boolean = false;
  noti_fail:boolean = false;

  constructor(private userService: UserService,
              private cookieService: CookieService,
              private router:Router
  ){};

  async ngOnInit(){
      await this.loadData();
  }

  notifySucces(){
    this.noti_succes = true;
    this.noti_fail = false;
  }

  notifyfail(){
    this.noti_fail = true;
    this.noti_succes = false;
  }

  async update(){
    if(this.newPassword == this.confrimeNewPassword){
      try{
        let res = await this.userService.changePassword(this.userData!.user_id, this.newPassword, this.confrimePass);
        await this.cookieService.set('userToken', res!.userToken, 30, '/');
        this.message =  await res?.message;
        this.notifySucces();
      }
      catch(err:any){
        console.log('Error:', err);
        this.message = await err.message;
        this.notifyfail();
      }
    }
    else{
      this.message = 'Invalid confrime new password';
      this.notifyfail();
    }
    
    
  }

  

  async loadData(){
    this.userData = await this.userService.getData();
  }
}
