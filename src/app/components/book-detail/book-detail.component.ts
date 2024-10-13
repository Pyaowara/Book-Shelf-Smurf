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
import { BookShopService  } from '../../services/book-service/book-shop.service';

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
  shopLinks: any[] = [];
  isChecked: boolean = false;
  spoilerVisibility: { [key: number]: boolean } = {};
  
  

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private bookService: BookService,
    private bookShopService: BookShopService
  ) {}

  async ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.book$ = this.http.get<any>(`https://book-back-lovat.vercel.app/books/${this.bookId}`).pipe(
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
    this.loadShopLinks();
    this.fetchVotingData();
    this.fetchComments();
  }

  loadShopLinks(): void {
    this.bookShopService.getShopsByBookId(Number(this.bookId)).subscribe((data) => {
      this.shopLinks = data;
    });
  }

  toggleSpoiler(commentId: number): void {
    this.spoilerVisibility[commentId] = !this.spoilerVisibility[commentId];
    console.log(this.spoilerVisibility[commentId]);
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
      this.http.get<any[]>(`https://book-back-lovat.vercel.app/books/voting-status/${this.userId}`).pipe(
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
    this.comments$ = this.http.get<any[]>(`https://book-back-lovat.vercel.app/comments/${this.bookId}/comments`).pipe(
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

    this.http.post(`https://book-back-lovat.vercel.app/comments/comments/${commentId}/upvote`, { userId: this.userId }).subscribe({
      next: () => {
        this.fetchComments();
        this.updateCommentVotes(commentId);
      },
      error: (error) => console.error('Error upvoting comment:', error)
    });
  }

  downvote(commentId: number): void {
    if (this.userId === null) return;

    this.http.post(`https://book-back-lovat.vercel.app/comments/comments/${commentId}/downvote`, { userId: this.userId }).subscribe({
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
        score: this.newScore,
        spoiler: this.isChecked
      }).subscribe(() => {
        this.newComment = '';
        this.fetchComments();
        this.updateBookScore();
      });
    }
  }

  updateBookScore(): void {
    if (this.bookId) {
      this.http.patch(`https://book-back-lovat.vercel.app/books/${this.bookId}/update-score`, {}).subscribe({
        next: () => {
          this.book$ = this.http.get<any>(`https://book-back-lovat.vercel.app/books/${this.bookId}`).pipe(
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
    this.http.patch(`https://book-back-lovat.vercel.app/comments/comments/${commentId}/update-votes`, {}).subscribe({
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

  async dropBook(): Promise<void> {
    await this.bookService.dropBook(Number(this.bookId));
    await this.router.navigate(['booklist']);
  }
  

  redirectToShop(shopLink: string): void {
    window.open(shopLink, '_blank');
  }

  confirmDeleteComment(commentId: number, event: Event): void {
    event.stopPropagation();
    const confirmation = confirm("Are you sure you want to delete this comment?");
    if (confirmation) {
      this.deleteComment(commentId);
    }
  }

  confirmDropBook(event: Event): void {
    event.stopPropagation();
    const confirmation = confirm("Are you sure you want to delete this book?");
    if (confirmation) {
      this.dropBook();
    }
  }
  
}
