import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.scss'],
  imports: [CommonModule, FormsModule]
})

export class ForumDetailComponent implements OnInit {
  newForum: string = '';
  replyForumComment = '';
  forumId: string | null = null;
  userId: number | null = null;
  replyMode: { [key: number]: boolean } = {};
  forumComments$: Observable<any[]> = of([]);
  votingData: any[] = [];
  forumTitle: string | null = null;

  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;
    });
    this.forumId = this.route.snapshot.paramMap.get('id');
    this.fetchForumComments();
    this.fetchForumTitle();
    console.log(this.forumId);
  }

  fetchForumTitle(): void {
    if (this.forumId) {
        this.http.get<{ title: string }>(`http://localhost:3000/forum-comments/${this.forumId}`).pipe(
            catchError(error => {
                console.error('Error fetching forum title:', error);
                return of({ title: 'Unknown Forum' });
            })
        ).subscribe(response => {
            console.log(response.title);
            this.forumTitle = response.title;
        });
    }
}

  fetchVotingData(): void {
    if (this.userId) {
      this.http.get<any[]>(`http://localhost:3000/forum-comments/voting-status/${this.userId}`).pipe(
        tap(votes => {
          this.votingData = votes;
        }),
        catchError(error => {
          console.error('Error fetching voting data:', error);
          return of([]);
        })
      ).subscribe();
    }
  }

  fetchForumComments(): void {
    this.forumComments$ = this.http.get<any[]>(`http://localhost:3000/forum-comments/findcomment/${this.forumId}`).pipe(
      map(comments => this.organizeComments(comments)),
      catchError(error => {
        console.error('Error fetching forum comments:', error);
        return of([]);
      })
    );
    this.fetchVotingData();
  }

  organizeComments(comments: any[]): any[] {
    const commentMap: { [key: number]: any } = {};
    const rootComments: any[] = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.forum_comment_id] = comment;

      if (comment.forum_comment_reply_id) {
        if (commentMap[comment.forum_comment_reply_id]) {
          commentMap[comment.forum_comment_reply_id].replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  submitForumComment(): void {
    if (this.newForum.trim() && this.forumId && this.userId !== null) {
      this.http.post(`http://localhost:3000/forum-comments/add`, {
        forum_id: this.forumId,
        comment_detail: this.newForum,
        user_id: this.userId,
      }).subscribe(() => {
        this.newForum = '';
        this.fetchForumComments();
      });
    }
  }

  submitForumReply(forumCommentId: number): void {
    if (this.replyForumComment.trim() && this.forumId && this.userId !== null) {
      this.http.post(`http://localhost:3000/forum-comments/reply`, {
        forum_id: this.forumId,
        comment_detail: this.replyForumComment,
        user_id: this.userId,
        forum_comment_reply_id: forumCommentId,
        spoiler: ''
      }).subscribe(() => {
        this.replyForumComment = '';
        this.replyMode[forumCommentId] = false;
        this.fetchForumComments();
      });
    }
  }

  deleteComment(forumCommentId: number): void {
    if (this.userId === null) {
      console.error('User ID is not available');
      return;
    }
    this.http.delete(`http://localhost:3000/forum-comments/${forumCommentId}/delete`, {
      body: { user_id: this.userId }
    }).subscribe(() => {
      this.fetchForumComments();
    });
  }

  upvote(forumCommentId: number): void {
    if (this.userId === null) return;

    this.http.post(`http://localhost:3000/forum-comments/${forumCommentId}/upvote`, { userId: this.userId }).subscribe(() => {
      this.fetchForumComments();
    });
  }

  downvote(forumCommentId: number): void {
    if (this.userId === null) return;

    this.http.post(`http://localhost:3000/forum-comments/${forumCommentId}/downvote`, { userId: this.userId }).subscribe(() => {
      this.fetchForumComments();
    });
  }

  hasUserVoted(forumCommentId: number, userId: number | null, voteType: string): boolean {
    if (userId === null) {
      return false;
    }
    return this.votingData.some(vote => vote.forum_comment_id === forumCommentId && vote.user_id === userId && vote.vote_type === voteType);
  }

  toggleReply(forumCommentId: number): void {
    this.replyMode[forumCommentId] = !this.replyMode[forumCommentId];
  }
}
