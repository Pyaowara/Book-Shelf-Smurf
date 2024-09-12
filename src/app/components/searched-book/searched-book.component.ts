// searched-book.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searched-book',
  templateUrl: './searched-book.component.html',
  styleUrls: ['./searched-book.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterModule, FormsModule] // Add RouterModule to imports
})
export class SearchedBookComponent implements OnInit {
  searchResults$: Observable<any[]> = new Observable();
  searchQuery: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['query'] || '';
      this.searchResults$ = this.http.get<any[]>(`https://books-shelves.vercel.app/searched?name=${query}`);
    });
  }

  getStars(score: number): string {
    return '⭐'.repeat(score);
  }
}
