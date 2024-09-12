import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-books',
  standalone: true,
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.css'],
  imports: [NgIf, NgFor, AsyncPipe, RouterModule]
})
export class AllBooksComponent implements OnInit {
  allBooks$: Observable<any[]> = new Observable();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.allBooks$ = this.http.get<any[]>('https://books-shelves.vercel.app/books').pipe(
      catchError(error => {
        console.error('Error fetching books:', error);
        return of([]);
      })
    );
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }
}
