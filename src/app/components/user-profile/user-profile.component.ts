import { Component, OnInit } from '@angular/core';
import { UserProfileResponse } from '../../services/user_service/user.respones.interface';
import { UserService } from '../../services/user_service/user.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  constructor(private route:ActivatedRoute,
              private authService:AuthService,
              private userService:UserService,
              private cookieService: CookieService,
              private router: Router
  ){}

  public isOwnerAccount:boolean = false;

  public userData:UserProfileResponse | null = null;

  async ngOnInit(){
    this.route.paramMap.subscribe(async params => {
      const userName = await params.get('id');
      console.log(userName);
      if (userName) {
        this.userData = await this.userService.getDataByParam(userName);
        await this.checkPermissionSetting(userName);
      }
    });
  }

  public async logout(){
    await this.authService.logout();
  }

  public async checkPermissionSetting(userName:string|null){
    let token = await this.cookieService.get('userToken');
    if(token.length > 0){
      let res = await this.authService.validateToken(token)
      if(res?.valid == true && res?.name == userName){
        this.isOwnerAccount = true;
      }
    }
  }

  public setting():void{
    this.router.navigate(['user-setting']);
  }

}

