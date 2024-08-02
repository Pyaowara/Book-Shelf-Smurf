import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { BookListComponent } from './app/components/book-list/book-list.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { loginAuthGuard } from './app/guard/login-auth.guard';



export const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch: 'full'},
  { path: 'booklist/:id', component: BookListComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent}
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes)
  ],
});
