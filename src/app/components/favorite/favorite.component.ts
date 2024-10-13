import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserProfileResponse } from '../../services/user_service/user.respones.interface';
import { UserService } from '../../services/user_service/user.service';
import { BookService } from '../../services/book-service/book.service';
@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit{
  favorite$: Observable<any[]> = new Observable();
  userData:UserProfileResponse | null = null;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private userService: UserService,
              private bookService: BookService) {}

  async ngOnInit(){
    await this.loadData();
    this.route.queryParams.subscribe(params => {
      this.favorite$ = this.http.get<any[]>(`https://book-back-lovat.vercel.app/books/get/favorite/`+this.userData?.user_id);
    });
  }

  async loadData(){
    this.userData = await this.userService.getData();
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }

  saveHistory(book_id:number){
    this.bookService.addHistory(this.userData!.user_id, book_id)
  }
}

