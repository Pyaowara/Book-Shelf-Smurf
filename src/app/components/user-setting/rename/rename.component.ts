import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user_service/user.service';
import { UserProfileResponse } from '../../../services/user_service/user.respones.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rename',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rename.component.html',
  styleUrl: './rename.component.scss'
})
export class RenameComponent implements OnInit{
  newname:string = '';
  confrimePass:string = '';
  userData:UserProfileResponse|null = null;
  message:string|undefined = '';
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

  async update() {
    try {
      let res = await this.userService.changeName(this.userData!.user_id, this.newname, this.confrimePass);
      await this.cookieService.set('userToken', res!.userToken, 30, '/');
      this.message = await res?.message;
      this.notifySucces();
    } catch (err: any) {
      console.log('Error:', err);
      this.message = await err.message;
      this.notifyfail();
    }
  }

  async loadData(){
    this.userData = await this.userService.getData();
  }
}
