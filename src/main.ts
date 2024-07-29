import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { BookListComponent } from './app/book-list/book-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'books', component: BookListComponent },
  { path: '', redirectTo: '/books', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Provide HTTP client
    provideRouter(routes)
  ],
});
