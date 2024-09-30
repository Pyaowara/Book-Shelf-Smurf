import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
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
  replyComment: string = '';
  replyMode: { [key: number]: boolean } = {};
  userId: number | null = null;
  bookId: string | null = '';
  newScore: number = 1;

  constructor(private route: ActivatedRoute, private http: HttpClient, private commentService: CommentService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.book$ = this.http.get<any>(`http://localhost:3000/books/${this.bookId}`).pipe(
        catchError(error => {
          console.error('Error fetching book:', error);
          return of({});
        })
      );
      this.authService.getUserId().subscribe(userId => {
        this.userId = userId;
      });
      this.fetchComments();
    }
  }

  fetchComments(): void {
    this.comments$ = this.http.get<any[]>(`http://localhost:3000/books/${this.bookId}/comments`).pipe(
      map(comments => this.organizeComments(comments)),
      catchError(error => {
        console.error('Error fetching comments:', error);
        return of([]);
      })
    );
  }
  
organizeComments(comments: any[]): any[] {
    const commentMap: { [key: number]: any } = {};
    const rootComments: any[] = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.comment_id] = comment;

      if (comment.reply_id) {
        if (commentMap[comment.reply_id]) {
          commentMap[comment.reply_id].replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }
  deleteComment(commentId: number): void {
    if (this.userId === null) {
      console.error('User ID is not available');
      return;
    }

    this.commentService.deleteComment(commentId, this.userId).subscribe({
      next: (response) => {
        console.log('Comment deleted successfully:', response);
        this.fetchComments();
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  upvote(commentId: number): void {
    this.http.post(`http://localhost:3000/books/comments/${commentId}/upvote`, {}).subscribe({
      next: () => this.fetchComments(),
      error: (error) => console.error('Error upvoting comment:', error)
    });
  }

  downvote(commentId: number): void {
    this.http.post(`http://localhost:3000/books/comments/${commentId}/downvote`, {}).subscribe({
      next: () => this.fetchComments(),
      error: (error) => console.error('Error downvoting comment:', error)
    });
  }

  submitComment(): void {
    if (this.newComment.trim() && this.bookId && this.userId !== null) {
      this.commentService.addComment({
        book_id: parseInt(this.bookId, 10),
        comment_detail: this.newComment,
        user_id: this.userId,
        score: this.newScore
      }).subscribe(() => {
        this.newComment = '';
        this.newScore = 1;
        this.fetchComments();
      });
    }
  }

  toggleReply(commentId: number): void {
    this.replyMode[commentId] = !this.replyMode[commentId];
  }

  submitReply(commentId: number): void {
    if (this.replyComment.trim() && this.bookId && this.userId !== null) {
      this.commentService.addReply({
        book_id: parseInt(this.bookId, 10),
        comment_detail: this.replyComment,
        user_id: this.userId,
        reply_id: commentId
      }).subscribe(() => {
        this.replyComment = '';
        this.replyMode[commentId] = false;
        this.fetchComments();
      });
    }
  }

  editBook(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/edit-book/' + bookId]);
  }
}
