import { Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { UserProfilePesponse } from './user.respones.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService{

  private token:string | null = null;

  constructor(private cookieService:CookieService,
              private http: HttpClient
  ) { }

  public async getData(){
    try {
      this.token = this.cookieService.get('userToken');
      return await lastValueFrom(
        this.http.post<UserProfilePesponse>(`http://localhost:8000/getUserProfile`, { token: this.token })
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

  
