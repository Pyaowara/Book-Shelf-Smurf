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
    release_date: string,
    publisher:number,
    serie:number,
    language:string
    
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
        release_date,
        publisher,
        serie,
        language
      };
      const result = await lastValueFrom(
        this.http.post<{ message: string, book_id: number }>(this.apiUrl + '/add/book', body)
      );

      return result;
    } catch (err) {
      console.error('Error adding book:', err);
      return null;
    }
  }

  async updateBooks(
    book_id:string|null,
    book_name_th: string,
    book_name_en: string,
    book_name_originl: string,
    book_category: string[],
    book_descriptions: string,
    book_status: string,
    book_price: number,
    book_pages: number,
    book_image: string,
    release_date: string,
    publisher:number,
    serie:number,
    language:string
    
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
        release_date,
        publisher,
        serie,
        language
      };
      const result = await lastValueFrom(
        this.http.post<{ message: string, book_id: number }>(this.apiUrl + '/update/book/'+book_id, body)
      );

      return result;
    } catch (err) {
      console.error('Error update book:', err);
      return null;
    }
  }

  async addShops(shops: {
    book_id: string;
    shop_link: string;
    shop_detail: string;
    shop_image: string;
    }[]) {
      try {
        const result = await lastValueFrom(
          this.http.post<{ message: string, shop_ids: number[] }>(this.apiUrl + '/add/shop', shops)
        );

        return result;
      } catch (err) {
        console.error('Error adding shops:', err);
        return null;
      }
    }
  
  async addSerie(serie_name_th:string, serie_name_en:string, serie_name_original:string, serie_status:string, serie_detail:string){
    try {
      const body = {serie_name_th, serie_name_en, serie_name_original, serie_status, serie_detail};
      const result = await lastValueFrom(
        this.http.post<{ message: string, serie_id: number }>(this.apiUrl + '/add/serie', body)
      );

      return result;
    } catch (err) {
      console.error('Error adding Serie:', err);
      return {message:'Failed to add series!!!'};
    }
  }

  async addPublisher(publisher_name:string, publisher_image:string){
    try {
      const body = {publisher_name, publisher_image};
      const result = await lastValueFrom(
        this.http.post<{ message: string,  publisher_id: number }>(this.apiUrl + '/add/publisher', body)
      );
      return result;
    } catch (err) {
      console.error('Error adding publisher:', err);
      return {message:'Failed to add Publisher!!!'};
    }
  }

  async getPublisher(){
    try {
      const result = await lastValueFrom(this.http.get<any>(this.apiUrl+'/get/publisher'))
      return result;
    }catch (error) {
      console.error('Error fetching publishers:', error);
      throw error;
    }
  }

  async getSerie(){
    try {
      const result = await lastValueFrom(this.http.get<any>(this.apiUrl+'/get/serie'))
      return result;
    }catch (error) {
      console.error('Error fetching publishers:', error);
      throw error;
    }
  }

  async getBookById(book_id:string|null){
    try {
      return await lastValueFrom(
        this.http.get<any>(`http://localhost:3000/books/`+book_id)
      );
    } catch (err) {
      return null;
    }
  }

  async getShop(book_id:string|null){
    try {
      return await lastValueFrom(
        this.http.get<any>(`http://localhost:3000/books/get/shop/`+book_id)
      );
    } catch (err) {
      return null;
    }
  }
}
