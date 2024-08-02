import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [CommonModule] // Import CommonModule here
})
export class BookListComponent {
  books$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.books$ = this.http.get<any[]>('http://localhost:3000/books').pipe(
      catchError(error => {
        console.error('Error fetching books:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }
}
