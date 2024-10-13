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
import { map } from 'rxjs/operators';


@Component({
  selector: 'history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit{
  history$: Observable<any[]> = new Observable();
  userData:UserProfileResponse | null = null;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private userService: UserService,
              private bookService: BookService) {}

  async ngOnInit(){
    await this.loadData();
    this.fetchBooks();
    
  }

  fetchBooks(){
    this.route.queryParams.subscribe(params => {
      this.history$ = this.http.get<any[]>(`https://book-back-lovat.vercel.app/books/get/history/` + this.userData?.user_id).pipe(
        map(history => 
          history.map(item => {
            return {
              ...item,
              time_stamp: this.formatDate(item.time_stamp)
            };
          })
        )
      );
    });
  }

  private formatDate(timeStamp: number): string {
    const date = new Date(timeStamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

  dropHistory(){
    this.bookService.dropHistory(Number(this.userData!.user_id));
    this.fetchBooks();
  }


}
