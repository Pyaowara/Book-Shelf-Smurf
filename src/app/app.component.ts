import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { FormsModule } from '@angular/forms';
import { AllBooksComponent } from './components/all-books/all-books.component';
import { RelatedBooks } from './components/related-books/related-books.component';
import { UserService } from './services/user_service/user.service';
import { UserProfileResponse } from './services/user_service/user.respones.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, BookListComponent, LoginComponent, RegisterComponent, BookDetailComponent, FormsModule, CommonModule, AllBooksComponent, RelatedBooks]
})
export class AppComponent{

  constructor(private router: Router,
              private userService:UserService
  ) {}

  public userData:UserProfileResponse | null = null;

  isLeftMenuVisible:boolean = false;
  searchQuery: string = '';

    goToBookList(): void {
      this.router.navigate(['booklist']);
    }

    goToAllBooks(): void {
      this.router.navigate(['/all-books']);
    }

    searchBooks() {
      if (this.searchQuery.trim()) {
        this.router.navigate(['/searched-book'], { queryParams: { query: this.searchQuery } });
      }
    }

    shouldShowControls(): boolean {
      const currentRoute = this.router.url;
      return !currentRoute.includes('/login') && !currentRoute.includes('/register');
    }

    async goToUserProfile() {
        await this.loadDataUser();
        this.router.navigate(['user-profile', this.userData?.user_name]);
    }

    leftMenuToggleButton(): void{
      if (this.isLeftMenuVisible == true){
        this.isLeftMenuVisible = false;
      }
      else if(this.isLeftMenuVisible == false){
        this.isLeftMenuVisible = true;
      }
    }

    async loadDataUser(){
      this.userData = await this.userService.getData();
    }
}