import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  books$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.books$ = this.http.get<any[]>('http://localhost:3000/books'); // Adjust API URL as needed
  }
}
