import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments/comments';

  constructor(private http: HttpClient) {}

  addComment(comment: { book_id: number; comment_detail: string; user_id: number, score: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, comment);
  }

  addReply(comment: { book_id: number; comment_detail: string; user_id: number , reply_id: number}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reply`, comment);
  }

  deleteComment(commentId: number, userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.delete<any>(`${this.apiUrl}/delete/${commentId}`, { params });
  }

  deleteForum(forumId: number, userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.delete<any>(`http://localhost:3000/forum-comments/forums/delete/${forumId}`, { params });
  }
}
