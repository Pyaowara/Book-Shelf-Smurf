import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { FormsModule } from '@angular/forms';
import { AllBooksComponent } from './components/all-books/all-books.component';
import { RelatedBooks } from './components/related-books/related-books.component';
import { UserService } from './services/user_service/user.service';
import { UserProfileResponse } from './services/user_service/user.respones.interface';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet,
    BookListComponent,
    LoginComponent,
    RegisterComponent,
    BookDetailComponent,
    FormsModule,
    CommonModule,
    AllBooksComponent,
    RelatedBooks,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
  ],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  public userData: UserProfileResponse | null = null;
  isLeftMenuVisible: boolean = false;
  opened= false;
  searchQuery: string = '';
  isFilterModalVisible: boolean = false;

  genres: string[] = [
    'Fiction',
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Horror',
    'Romance',
    'Historical Fiction',
    'Literary Fiction',
    'Young Adult',
    "Children's",
    'Graphic Novels',
    'Dystopian',
    'Action',
    'Western',
    'Nonfiction',
    'History',
    'Biography/Autobiography',
    'Self-help',
    'Science & Technology',
    'Health & Wellness',
    'Business & Economics',
    'True Crime',
    'Travel',
    'Cookbooks',
    'Art & Photography',
    'Religion & Spirituality',
    'Philosophy',
    'Humor',
    'Essays',
    'Reference',
    'Girl Love',
    'Boy Love',
    'R18+',
    'Light Novel',
    'Manga',
    'Manwha',
    'Manhua',
    'Comic',
    'SuperHero',
    'Drama',
    'Adventure',
  ];

  selectedGenres: { [key: string]: boolean } = {};

  async ngOnInit() {
    await this.loadDataUser();
  }

  goToBookList(): void {
    this.router.navigate(['booklist']);
  }

  goToAllBooks(): void {
    this.router.navigate(['/all-books']);
  }

  goToAddBooks(): void {
    this.router.navigate(['add-book']);
  }

  goToAddSeries(): void {
    this.router.navigate(['add-serie']);
  }

  goToAddPublisher(): void {
    this.router.navigate(['add-publisher']);
  }

  goToAddAuthor(): void {
    this.router.navigate(['add-author']);
  }

  goToFavorite(): void {
    this.router.navigate(['favorite/book']);
  }

  goToAllHistory(): void {
    this.router.navigate(['history/book']);
  }

  goToForums(): void {
    this.router.navigate(['forums']);
  }

  searchBooks() {
    const queryParams: any = { query: this.searchQuery };
    const selectedCategories = this.genres.filter(
      (genre) => this.selectedGenres[genre]
    );
    if (selectedCategories.length > 0) {
      queryParams.categories = selectedCategories.join(',');
    }
    this.router.navigate(['/searched-book'], { queryParams });
  }

  shouldShowControls(): boolean {
    const currentRoute = this.router.url;
    return (
      !currentRoute.includes('/login') && !currentRoute.includes('/register')
    );
  }

  async goToUserProfile() {
    await this.loadDataUser();
    this.router.navigate(['user-profile', this.userData?.user_name]);
  }

  leftMenuToggleButton(): void {
    this.isLeftMenuVisible = !this.isLeftMenuVisible;
  }

  async loadDataUser() {
    this.userData = await this.userService.getData();
  }

  toggleFilterModal(): void {
    this.isFilterModalVisible = !this.isFilterModalVisible;
    if (this.isFilterModalVisible) {
      this.genres.forEach((genre) => {
        this.selectedGenres[genre] = false;
      });
    }
  }

  applyFilters(): void {
    console.log(this.selectedGenres);
    this.searchQuery = '';
    this.searchBooks();
    this.toggleFilterModal();
  }

  onCategorySelect(genre: string): void {
    this.selectedGenres[genre] = !this.selectedGenres[genre];
  }
}
