import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { BookListComponent } from './app/components/book-list/book-list.component';
import { BookDetailComponent } from './app/components/book-detail/book-detail.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { SearchedBookComponent } from './app/components/searched-book/searched-book.component';
import { AllBooksComponent } from './app/components/all-books/all-books.component';
import { RelatedBooks } from './app/components/related-books/related-books.component';
import { UserProfileComponent } from './app/components/user-profile/user-profile.component';
import { UserSettingComponent } from './app/components/user-setting/user-setting.component';
import { authGuard } from './app/auth/guard/auth/auth.guard';
import { initGuard } from './app/auth/guard/init/init.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'booklist', component: BookListComponent, canActivate:  [authGuard]},
  { path: 'book/:id', component: BookDetailComponent, canActivate:  [authGuard] },
  { path: 'series/:id', component: RelatedBooks, canActivate:  [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [initGuard]},
  { path: 'register', component: RegisterComponent},
  { path: 'searched-book', component: SearchedBookComponent, canActivate:  [authGuard] },
  { path: 'all-books', component: AllBooksComponent ,canActivate:  [authGuard]},
  { path: 'user-profile/:id', component:UserProfileComponent, canActivate: [authGuard]},
  { path: 'user-setting', component:UserSettingComponent, canActivate: [authGuard] }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes)
  ],
});
