import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookShopService {
  private apiUrl = 'https://book-back-lovat.vercel.app/book-shop/shops';

  constructor(private http: HttpClient) {}

  getShopsByBookId(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${bookId}`);
  }
}
