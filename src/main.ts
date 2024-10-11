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
import { AddBookComponent } from './app/components/add-book/add-book.component';
import { authGuard } from './app/auth/guard/auth/auth.guard';
import { initGuard } from './app/auth/guard/init/init.guard';
import { AddSerieComponent } from './app/components/add-serie/add-serie.component';
import { AddPublisherComponent } from './app/components/add-publisher/add-publisher.component';
import { EditBookComponent } from './app/components/edit-book/edit-book.component';
import { publisherGuard } from './app/auth/guard/publisher/publisher.guard';
import { AddAuthorComponent } from './app/components/add-author/add-author/add-author.component';
import { managerGuard } from './app/auth/guard/manager/manager.guard';
import { FavoriteComponent } from './app/components/favorite/favorite.component';
import { HistoryComponent } from './app/components/history/history.component';
import { ForumComponent } from './app/components/forum/forum.component';
import { ForumDetailComponent } from './app/components/forum-detail/forum-detail.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
  { path: 'user-setting', component:UserSettingComponent, canActivate: [authGuard] },
  { path: 'add-book', component:AddBookComponent, canActivate: [authGuard, publisherGuard]},
  { path: 'add-serie', component:AddSerieComponent, canActivate: [authGuard, publisherGuard]},
  { path: 'add-publisher', component:AddPublisherComponent, canActivate: [authGuard, managerGuard]},
  { path: 'edit-book/:id', component:EditBookComponent, canActivate: [authGuard, publisherGuard]},
  { path: 'add-author', component:AddAuthorComponent, canActivate: [authGuard, publisherGuard]},
  { path: 'add-author', component:AddAuthorComponent, canActivate: [authGuard, publisherGuard]},
  { path: 'favorite/book', component:FavoriteComponent, canActivate: [authGuard]},
  { path: 'history/book', component:HistoryComponent, canActivate: [authGuard]},
  { path: 'forums', component:ForumComponent, canActivate: [authGuard]},
  { path: 'forums/:id', component:ForumDetailComponent, canActivate: [authGuard]},
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes), provideAnimationsAsync()
  ],
});
