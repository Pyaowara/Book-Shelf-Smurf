import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class BookListComponent {
  books$: Observable<any[]>;
  booksByCategory: { [key: string]: any[] } = {};
  categories: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.books$ = this.http.get<any[]>('https://books-shelves.vercel.app/books').pipe(
      catchError(error => {
        console.error('Error fetching books:', error);
        return of([]); 
      })
    );

    this.books$.subscribe(books => {
      books.forEach(book => {
        const categories = book.book_category.split(',').map((category: string) => category.trim());
        categories.forEach((category: string) => {
          if (!this.booksByCategory[category]) {
            this.booksByCategory[category] = [];
          }
          this.booksByCategory[category].push(book);
        });
      });

      this.categories = Object.keys(this.booksByCategory)
        .sort((a, b) => this.booksByCategory[b].length - this.booksByCategory[a].length)
        .slice(0, 5); 
    });
  }

  getBooksByCategory(category: string): any[] {
    return this.booksByCategory[category] || [];
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }
}
