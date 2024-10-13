// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'https://book-back-lovat.vercel.app/books'; // Your backend URL

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
    language:string,
    author:number
    
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
        language,
        author
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
    language:string,
    author:number
    
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
        language,
        author
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

  async addHistory(user_id:string, book_id:number){
    try {
      const body = {user_id, book_id};
      const result = await lastValueFrom(
        this.http.post<{ message: string,  history_id: number }>(this.apiUrl + '/add/history', body)
      );
      return result;
    } catch (err) {
      console.error('Error adding history:', err);
      return {message:'Failed to add history!!!'};
    }
  }

  async addFavorite(user_id:string, book_id:number){
    try {
      const body = {user_id, book_id};
      const result = await lastValueFrom(
        this.http.post<{ message: string,  favorite: number }>(this.apiUrl + '/add/favorite', body)
      );
      return result;
    } catch (err) {
      console.error('Error adding favorite:', err);
      return {message:'Failed to add favorite!!!'};
    }
  }

  async dropFavorite(user_id:string, book_id:number){
    try {
      const body = {user_id, book_id};
      const result = await lastValueFrom(
        this.http.post<{ message: string,  favorite: number }>(this.apiUrl + '/drop/favorite', body)
      );
      return result;
    } catch (err) {
      console.error('Error drop favorite:', err);
      return {message:'Failed to drop favorite!!!'};
    }
  }

  async dropHistory(user_id:number){
    try {
      const result = await lastValueFrom(
        this.http.get<{ message: string,  favorite: number }>(this.apiUrl + '/drop/history/'+user_id)
      );
      return result;
    } catch (err) {
      console.error('Error drop history:', err);
      return {message:'Failed to drop history!!!'};
    }
  }

  async dropBook(book_id:number){
    try {
      const result = await lastValueFrom(
        this.http.get<{ message: string }>(this.apiUrl + '/drop/book/'+book_id)
      );
      return result;
    } catch (err) {
      console.error('Error drop book:', err);
      return {message:'Failed to drop book!!!'};
    }
  }

  async getFavorite(user_id:number){
    try {
      const result = await lastValueFrom(
        this.http.get<{ message: string,  favorite: number }>(this.apiUrl + '/get/favorite/'+user_id)
      );
      return result;
    } catch (err) {
      console.error('Error get favorite:', err);
      return {message:'Failed to get favorite!!!'};
    }
  }

  async addAuthor(author_name:string, author_image:string, author_description:string){
    try {
      const body = {author_name, author_image, author_description};
      const result = await lastValueFrom(
        this.http.post<{ message: string,  author_id: number,}>(this.apiUrl + '/add/author', body)
      );
      return result;
    } catch (err) {
      console.error('Error adding author:', err);
      return {message:'Failed to add author!!!'};
    }
  }

  async getAuthor(){
    try {
      const result = await lastValueFrom(this.http.get<any>(this.apiUrl+'/get/author'))
      return result;
    }catch (error) {
      console.error('Error fetching author:', error);
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
        this.http.get<any>(`https://book-back-lovat.vercel.app/books/`+book_id)
      );
    } catch (err) {
      return null;
    }
  }

  async getShop(book_id:string|null){
    try {
      return await lastValueFrom(
        this.http.get<any>(`https://book-back-lovat.vercel.app/books/get/shop/`+book_id)
      );
    } catch (err) {
      return null;
    }
  }
}
