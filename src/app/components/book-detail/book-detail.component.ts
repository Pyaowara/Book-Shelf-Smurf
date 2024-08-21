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
  imports: [CommonModule]
})
export class BookDetailComponent implements OnInit {
  book$: Observable<any> = of({});
  comments$: Observable<any[]> = of([]);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.book$ = this.http.get<any>(`https://smurf-fr.vercel.app/books/${bookId}`).pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          return of({});
        })
      );

      this.comments$ = this.http.get<any[]>(`https://smurf-fr.vercel.app/books/${bookId}/comments`).pipe(
        catchError(error => {
          console.error('Error fetching comments:', error);
          return of([]);
        })
      );
    }
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }

  upvote(commentId: number): void {
    this.http.post(`https://smurf-fr.vercel.app/comments/${commentId}/upvote`, {}).subscribe({
      next: () => this.refreshComments(),
      error: (error) => console.error('Error upvoting comment:', error)
    });
  }

  downvote(commentId: number): void {
    this.http.post(`https://smurf-fr.vercel.app/comments/${commentId}/downvote`, {}).subscribe({
      next: () => this.refreshComments(),
      error: (error) => console.error('Error downvoting comment:', error)
    });
  }

  refreshComments(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.comments$ = this.http.get<any[]>(`https://smurf-fr.vercel.app/books/${bookId}/comments`).pipe(
        catchError(error => {
          console.error('Error refreshing comments:', error);
          return of([]);
        })
      );
    }
  }
}
