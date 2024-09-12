import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'https://books-shelves.vercel.app/comments';

  constructor(private http: HttpClient) {}

  addComment(comment: { book_id: number; comment_detail: string; user_id: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, comment);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${commentId}`);
  }
}
