import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.book$ = this.http.get<any>(`https://books-shelves.vercel.app/books/${bookId}`).pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          return of({});
        })
      );

      this.book$.subscribe(book => {
        if (book.serie_id) {
          this.seriesBooks$ = this.http.get<any[]>(`https://books-shelves.vercel.app/books/series/${book.serie_id}`).pipe(
            catchError(error => {
              console.error('Error fetching books by series:', error);
              return of([]);
            })
          );
        }
      });
    }
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }

  navigateToBook(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }
}
