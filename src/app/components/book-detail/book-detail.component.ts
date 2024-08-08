import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  imports: [CommonModule]  // Add this line
})
export class BookDetailComponent implements OnInit {
  book$: Observable<any> = of({});
  description$: Observable<any> = of({});

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.book$ = this.http.get<any>(`http://localhost:3000/books/${bookId}`).pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          return of({});
        })
      );

      this.description$ = this.http.get<any>(`http://localhost:3000/book_description?book_id=${bookId}`).pipe(
        catchError(error => {
          console.error('Error fetching description:', error);
          return of({});
        })
      );
    }
  }
}
