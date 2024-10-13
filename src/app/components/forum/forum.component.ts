import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment-service/comment.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  forums$: Observable<any[]> = of([]);
  newForum: string = '';
  userId: number | null = null;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;
    });
    this.fetchForums();
  }

  postForum(): void {
    if (this.newForum.trim() && this.userId !== null) {
      const forumPostData = {
        user_id: this.userId,
        forum_content: this.newForum
      };

      this.http.post('https://book-back-lovat.vercel.app/forum-comments/forum-post', forumPostData).pipe(
        tap(() => {
          this.newForum = '';
          this.fetchForums();
        }),
        catchError(error => {
          console.error('Error posting forum:', error);
          return of([]);
        })
      ).subscribe();
    }
  }

  fetchForums(): void {
    this.forums$ = this.http.get<any[]>(`https://book-back-lovat.vercel.app/forum-comments/forums/load-forums`).pipe(
        tap(forums => {
            console.log('Fetched forums:', forums);
        }),
        catchError(error => {
            console.error('Error fetching comments:', error);
            return of([]);
        }),
    );
}
  navigateToForum(forumId: number): void {
    this.router.navigate([`/forums/${forumId}`]);
  }

  deleteForum(forumId: number, event: Event): void {
    event.stopPropagation();
    if (this.userId === null) {
      console.error('User ID is not available');
      return;
    }
    this.commentService.deleteForum(forumId, this.userId).subscribe({
      next: (response) => {
        console.log('Comment deleted successfully:', response);
        this.fetchForums();
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  confirmDelete(forumId: number, event: Event): void {
    event.stopPropagation();
    const confirmation = confirm("Are you sure you want to delete this forum post?");
    if (confirmation) {
      this.deleteForum(forumId, event);
    }
  }


}
