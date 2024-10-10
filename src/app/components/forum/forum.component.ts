import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;
    });
  }

  postForum(): void {
    if (this.newForum.trim() && this.userId !== null) {
      const forumPostData = {
        user_id: this.userId,
        forum_content: this.newForum
      };

      this.http.post('http://localhost:3000/books/forum-post', forumPostData).pipe(
        tap(() => {
          this.newForum = '';
        }),
        catchError(error => {
          console.error('Error posting forum:', error);
          return of([]);
        })
      ).subscribe();
    }
  }
}
