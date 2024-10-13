import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfileResponse } from '../../services/user_service/user.respones.interface';
import { UserService } from '../../services/user_service/user.service';
import { BookService } from '../../services/book-service/book.service';

@Component({
  selector: 'app-all-books',
  standalone: true,
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.css'],
  imports: [NgIf, NgFor, AsyncPipe, RouterModule]
})
export class AllBooksComponent implements OnInit {
  allBooks$: Observable<any[]> = new Observable();
  userData:UserProfileResponse | null = null;

  constructor(private http: HttpClient,
              private userService: UserService,
              private bookService: BookService) {}

  async ngOnInit() {
    this.allBooks$ = this.http.get<any[]>('https://book-back-lovat.vercel.app/books/all').pipe(
      catchError(error => {
        console.error('Error fetching books:', error);
        return of([]);
      })
    );
    await this.loadData();
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
