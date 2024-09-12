import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment-service/comment.service';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BookDetailComponent implements OnInit {
  book$: Observable<any> = of({});
  comments$: Observable<any[]> = of([]);
  newComment: string = '';
  userId: number | null = null;
  bookId: string | null = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private commentService: CommentService, private authService: AuthService) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.book$ = this.http.get<any>(`https://books-shelves.vercel.app/books/${this.bookId}`).pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          return of({});
        })
      );
      this.authService.getUserId().subscribe(userId => {
        this.userId = userId;
      });
      this.comments$ = this.http.get<any[]>(`https://books-shelves.vercel.app/books/${this.bookId}/comments`).pipe(
        catchError(error => {
          console.error('Error fetching comments:', error);
          return of([]);
        })
      );
    }
  }
  submitComment(): void {
    if (this.newComment.trim() && this.bookId && this.userId !== null) {
      this.commentService.addComment({
        book_id: parseInt(this.bookId, 10),
        comment_detail: this.newComment,
        user_id: this.userId
      }).subscribe({
        next: () => {
          this.newComment = '';
          this.refreshComments();
        },
        error: (err) => {
          console.error('Error submitting comment:', err);
        }
      });
    }
  }
  
  deleteComment(commentId: number): void {
    if (this.userId === null) {
      console.error('User ID is not available');
      return;
    }

    this.http.delete(`https://books-shelves.vercel.app/comments/delete/${commentId}`, { body: { userId: this.userId } }).subscribe({
      next: () => this.refreshComments(),
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }

  upvote(commentId: number): void {
    this.http.post(`https://books-shelves.vercel.app/comments/${commentId}/upvote`, {}).subscribe({
      next: () => this.refreshComments(),
      error: (error) => console.error('Error upvoting comment:', error)
    });
  }

  downvote(commentId: number): void {
    this.http.post(`https://books-shelves.vercel.app/comments/${commentId}/downvote`, {}).subscribe({
      next: () => this.refreshComments(),
      error: (error) => console.error('Error downvoting comment:', error)
    });
  }

  refreshComments(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.comments$ = this.http.get<any[]>(`https://books-shelves.vercel.app/books/${bookId}/comments`).pipe(
        catchError(error => {
          console.error('Error refreshing comments:', error);
          return of([]);
        })
      );
    }
  }
}
