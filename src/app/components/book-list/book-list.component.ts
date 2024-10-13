import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
// import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSlideToggleModule,
    DragScrollComponent,
    DragScrollItemDirective,
    // MatSidenavModule,
  ],
})
export class BookListComponent {
  books$: Observable<any[]>;
  booksByCategory: { [key: string]: any[] } = {};
  categories: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.books$ = this.http.get<any[]>('https://book-back-lovat.vercel.app/books').pipe(
      catchError((error) => {
        console.error('Error fetching books:', error);
        return of([]);
      })
    );

    this.books$.subscribe((books) => {
      books.forEach((book) => {
        if (Array.isArray(book.book_category)) {
          book.book_category.forEach((category: string) => {
            category = category.trim();
            if (!this.booksByCategory[category]) {
              this.booksByCategory[category] = [];
            }
            this.booksByCategory[category].push(book);
          });
        } else {
          console.warn(
            `Expected array for book_category but got: ${typeof book.book_category}`
          );
        }
      });

      this.categories = Object.keys(this.booksByCategory)
        .sort(
          (a, b) =>
            this.booksByCategory[b].length - this.booksByCategory[a].length
        )
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
