import { Component, OnInit } from '@angular/core';
import { UserProfileResponse } from '../../services/user_service/user.respones.interface';
import { UserService } from '../../services/user_service/user.service';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { RenameComponent } from './rename/rename.component';
import { ReemailComponent } from './reemail/reemail.component';
import { RepasswordComponent } from './repassword/repassword.component';
import { RephoneComponent } from './rephone/rephone.component';

@Component({
  selector: 'app-user-setting',
  standalone: true,
  imports: [CommonModule, FormsModule, RenameComponent, ReemailComponent, RepasswordComponent, RephoneComponent],
  templateUrl: './user-setting.component.html',
  styleUrl: './user-setting.component.scss'
})
export class UserSettingComponent implements OnInit{
  public userData:UserProfileResponse | null = null;
  public userPass:string = '******************';
  public oldUserPass:string = '';
  public message:string = '';
  public isVisible:string = 'rename';

  constructor(private userService: UserService,
              private authService: AuthService

  ){};

  async ngOnInit(){
    this.loadData();
  }

  back(){
    window.history.back();
  }

  async loadData(){
    this.userData = await this.userService.getData();
  }

  changePhone(){
    this.isVisible = 'rephone';
  }

  changeEmail(){
    this.isVisible = 'reemail';
  }

  changeName(){
    this.isVisible = 'rename';
  }
  
  changePassword(){
    this.isVisible = 'repassword';
  }
}