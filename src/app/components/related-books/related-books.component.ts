import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserProfileResponse } from '../../services/user_service/user.respones.interface';
import { UserService } from '../../services/user_service/user.service';
import { BookService } from '../../services/book-service/book.service';

@Component({
  selector: 'app-book-related',
  standalone: true,
  templateUrl: './related-books.component.html',
  styleUrls: ['./related-books.component.css'],
  imports: [CommonModule]
})
export class RelatedBooks implements OnInit {
  book$: Observable<any> = of({});
  seriesBooks$: Observable<any[]> = of([]);
  userData:UserProfileResponse | null = null;

  constructor(private route: ActivatedRoute,
              private http: HttpClient, 
              private router: Router,
              private userService: UserService,
              private bookService: BookService) {}

  async ngOnInit(){
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.book$ = this.http.get<any>(`https://book-back-lovat.vercel.app/books/${bookId}`).pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          return of({});
        })
      );

      this.book$.subscribe(book => {
        if (book.serie.serie_id) {
          this.seriesBooks$ = this.http.get<any[]>(`https://book-back-lovat.vercel.app/books/series/${book.serie.serie_id}`).pipe(
            catchError(error => {
              console.error('Error fetching books by series:', error);
              return of([]);
            })
          );
        }
      });
    }
    await this.loadData();
  }

  async loadData(){
    this.userData = await this.userService.getData();
  }

  saveHistory(book_id:number){
    this.bookService.addHistory(this.userData!.user_id, book_id)
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }

  navigateToBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
    this.saveHistory(bookId);
  }
}
