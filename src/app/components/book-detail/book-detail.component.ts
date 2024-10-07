import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment-service/comment.service';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user_service/user.service';
import { BookService } from '../../services/book-service/book.service';

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
  userData: any;
  votingData: any[] = [];
  isFavorite: boolean = false;
  allfavorite: any;
  

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private bookService: BookService
  ) {}

  async ngOnInit() {
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
    }
    await this.loadDataUser();
    await this.loadFavorite();
    this.fetchVotingData();
    this.fetchComments();
  }

  async loadDataUser() {
    this.userData = await this.userService.getData();
  }

  async loadFavorite() {
    this.allfavorite = await this.bookService.getFavorite(this.userData.user_id);
    this.isFavorite = this.checkFavorite(Number(this.bookId));
 
  }

  checkFavorite(book_id: number) {
    return this.allfavorite.some((favorite: any) => favorite.book.book_id === book_id);
  }
  

  fetchVotingData(): void {
    if (this.userId) {
      this.http.get<any[]>(`http://localhost:3000/books/voting-status/${this.userId}`).pipe(
        tap(votes => {
          this.votingData = votes;
        }),
        catchError(error => {
          console.error('Error fetching voting data:', error);
          return of([]);
        })
      ).subscribe();
    }
    else{
      console.log("Doesn't do shits");
    }
  }

  fetchComments(): void {
    this.comments$ = this.http.get<any[]>(`http://localhost:3000/books/${this.bookId}/comments`).pipe(
        map(comments => this.organizeComments(comments)),
        catchError(error => {
            console.error('Error fetching comments:', error);
            return of([]);
        }),
    );
    this.fetchVotingData();
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
        this.updateBookScore();
        this.fetchComments();
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  upvote(commentId: number): void {
    if (this.userId === null) return;

    this.http.post(`http://localhost:3000/books/comments/${commentId}/upvote`, { userId: this.userId }).subscribe({
      next: () => {
        this.fetchComments();
        this.updateCommentVotes(commentId);
      },
      error: (error) => console.error('Error upvoting comment:', error)
    });
  }

  downvote(commentId: number): void {
    if (this.userId === null) return;

    this.http.post(`http://localhost:3000/books/comments/${commentId}/downvote`, { userId: this.userId }).subscribe({
      next: () => {
        this.fetchComments();
        this.updateCommentVotes(commentId);
      },
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
        this.fetchComments();
        this.updateBookScore();
      });
    }
  }

  updateBookScore(): void {
    if (this.bookId) {
      this.http.patch(`http://localhost:3000/books/${this.bookId}/update-score`, {}).subscribe({
        next: () => {
          this.book$ = this.http.get<any>(`http://localhost:3000/books/${this.bookId}`).pipe(
            catchError(error => {
              console.error('Error fetching book:', error);
              return of({});
            })
          );
        },
        error: (error) => console.error('Error updating book score:', error)
      });
    }
  }

  hasUserVoted(commentId: number, userId: number | null, voteType: string): boolean {
    if (userId === null){
      return false;
    }
    return this.votingData.some(vote => vote.comment_id === commentId && vote.user_id === userId && vote.vote_type === voteType);
}

  updateCommentVotes(commentId: number): void {
    this.http.patch(`http://localhost:3000/books/comments/${commentId}/update-votes`, {}).subscribe({
      next: () => {
        this.fetchComments();
      },
      error: (error) => console.error('Error updating comment votes:', error)
    });
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

  addFavorite(book_id: number) {
    this.bookService.addFavorite(this.userData!.user_id, book_id);
    this.isFavorite = !this.isFavorite;
  }

  dropFavorite(book_id: number) {
    this.bookService.dropFavorite(this.userData!.user_id, book_id);
    this.isFavorite = !this.isFavorite;
  }
}
