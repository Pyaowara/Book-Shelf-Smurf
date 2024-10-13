import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserProfileResponse } from '../../services/user_service/user.respones.interface';
import { UserService } from '../../services/user_service/user.service';
import { BookService } from '../../services/book-service/book.service';

@Component({
  selector: 'app-searched-book',
  templateUrl: './searched-book.component.html',
  styleUrls: ['./searched-book.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterModule, FormsModule]
})
export class SearchedBookComponent implements OnInit {
  searchResults$: Observable<any[]> = new Observable();
  searchQuery: string = '';
  selectedCategory: string = '';
  userData:UserProfileResponse | null = null;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private userService: UserService,
              private bookService: BookService) {}

  async ngOnInit(){
    this.route.queryParams.subscribe(params => {
      const query = params['query'] || '';
      const category = params['categories'] || '';
      console.log(query, category);
      this.searchResults$ = this.http.get<any[]>(`https://book-back-lovat.vercel.app/books/searched/f?name=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    });
    await this.loadData();
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }

  async loadData(){
    this.userData = await this.userService.getData();
  }

  saveHistory(book_id:number){
    this.bookService.addHistory(this.userData!.user_id, book_id)
  }
}
