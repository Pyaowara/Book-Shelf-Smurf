// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:3000/books'; // Your backend URL

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  async addBooks(
    book_name_th: string,
    book_name_en: string,
    book_name_originl: string,
    book_category: string[],
    book_descriptions: string,
    book_status: string,
    book_price: number,
    book_pages: number,
    book_image: string,
    release_date: string
  ) {
    try {
      const body = {
        book_name_th,
        book_name_en,
        book_name_originl,
        book_category,
        book_descriptions,
        book_status,
        book_price,
        book_pages,
        book_image,
        release_date
      };
        const result = await lastValueFrom(
        this.http.post<{ message: string }>(this.apiUrl + '/add/book', body)
      );
  
      return result;
    } catch (err) {
      console.error('Error adding book:', err);
      return null;
    }
  }
}

