import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book-service/book.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss'
})
export class AddBookComponent {
  constructor(private bookService:BookService){}

  base64Image: string | null = null;
  book_name_th:string = '';
  book_name_en:string = '';
  book_name_originl:string = '';
  book_category:string[] = [];
  book_descriptions:string = '';
  book_status:string = '';
  book_price:number = 0;
  book_pages:number = 0;
  release_date:string = '';

  message:string = '';


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent: any) => {
        const dataUrl = loadEvent.target.result;
        this.base64Image = dataUrl;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Invalid file type. Please upload an image file.');
    }
  }

  categories = [
    { id: 'fiction', label: 'Fiction', selected: false },
    { id: 'fantasy', label: 'Fantasy', selected: false },
    { id: 'sci-fi', label: 'Science Fiction', selected: false },
    { id: 'mystery', label: 'Mystery', selected: false },
    { id: 'horror', label: 'Horror', selected: false },
    { id: 'romance', label: 'Romance', selected: false },
    { id: 'historical-fiction', label: 'Historical Fiction', selected: false },
    { id: 'literary-fiction', label: 'Literary Fiction', selected: false },
    { id: 'young-adult', label: 'Young Adult', selected: false },
    { id: 'children', label: 'Children\'s', selected: false },
    { id: 'graphic-novels', label: 'Graphic Novels', selected: false },
    { id: 'dystopian', label: 'Dystopian', selected: false },
    { id: 'action', label: 'Action', selected: false },
    { id: 'western', label: 'Western', selected: false },
    { id: 'nonfiction', label: 'Nonfiction', selected: false },
    { id: 'history', label: 'History', selected: false },
    { id: 'biography', label: 'Biography/Autobiography', selected: false },
    { id: 'self-help', label: 'Self-help', selected: false },
    { id: 'science-tech', label: 'Science & Technology', selected: false },
    { id: 'health-wellness', label: 'Health & Wellness', selected: false },
    { id: 'business-economics', label: 'Business & Economics', selected: false },
    { id: 'true-crime', label: 'True Crime', selected: false },
    { id: 'travel', label: 'Travel', selected: false },
    { id: 'cookbooks', label: 'Cookbooks', selected: false },
    { id: 'art-photography', label: 'Art & Photography', selected: false },
    { id: 'religion-spirituality', label: 'Religion & Spirituality', selected: false },
    { id: 'philosophy', label: 'Philosophy', selected: false },
    { id: 'humor', label: 'Humor', selected: false },
    { id: 'essays', label: 'Essays', selected: false },
    { id: 'reference', label: 'Reference', selected: false },
    { id: 'girl-love', label: 'Girl Love', selected: false },
    { id: 'boy-love', label: 'Boy Love', selected: false },
    { id: 'r18', label: 'R18+', selected: false },
    { id: 'light-novel', label: 'Light Novel', selected: false },
    { id: 'manga', label: 'Manga', selected: false },
    { id: 'manwha', label: 'Manwha', selected: false },
    { id: 'manhua', label: 'manhua', selected: false },
    { id: 'comic', label: 'Comic', selected: false },
    { id: 'superhero', label: 'SuperHero', selected: false },
    { id: 'drama', label: 'Drama', selected: false },
    { id: 'adventure', label: 'Adventure', selected: false }
  ];

  getSelectedValues() {
    const selectedValues = this.categories
      .filter(category => category.selected)
      .map(category => category.label);
    this.book_category = selectedValues;
  }

  async submit(){
    await this.getSelectedValues();
    let res = await this.bookService.addBooks(this.book_name_th, this.book_name_en, this.book_name_originl, this.book_category, this.book_descriptions, this.book_status,
      this.book_price, this.book_pages, this.base64Image!, this.release_date);
    this.message = res!.message;
  }
}
