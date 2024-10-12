import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book-service/book.service';
import { UserService } from '../../services/user_service/user.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss'
})
export class AddBookComponent implements OnInit{
  constructor(private bookService: BookService,
              private userService: UserService
  ) { }

  base64Image: string | null = null;
  book_name_th: string = '';
  book_name_en: string = '';
  book_name_originl: string = '';
  book_category: string[] = [];
  book_descriptions: string = '';
  book_status: string = '';
  book_price: number = 0;
  book_pages: number = 0;
  release_date: string = '';
  selectedPublisherId: string = ''
  selectedSerie: string = '';
  selectedAuthor: string = '';
  language:string = '';
  noti_succes:boolean = false;
  noti_fail:boolean = false;

  message: string = '';

  numberOfLinks: number = 0;
  links: { book_id: string, shop_link: string, shop_detail: string, shop_image: string }[] = [];
  author_all: {author_id:string, author_name:string, author_description:string, author_image:string}[] = [];
  publisher_all: {publisher_id:string, publisher_name:string, publisher_image:string}[] = [];
  serie_all: {serie_id:string, serie_name_th:string, serie_name_en:string, serie_name_original:string, serie_status:string, serie_detail:string}[] = [];

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

  userData:any;

  async ngOnInit(){
      this.publisher_all = await this.bookService.getPublisher();
      this.serie_all = await this.bookService.getSerie();
      this.author_all = await this.bookService.getAuthor();
      this.userData = await this.userService.getData();
      if(this.userData?.publisher_id != null){
        this.selectedPublisherId = this.userData?.publisher_id;
      }
  }

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

  onFileChangeShopLink(event: any, index: number) {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type. Please upload an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent: any) => {
        const dataUrl = loadEvent.target.result;
        this.links[index].shop_image = dataUrl;
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected. Please choose an image file.');
    }
  }

  notifySucces(){
    this.noti_succes = true;
    this.noti_fail = false;
  }

  notifyfail(){
    this.noti_fail = true;
    this.noti_succes = false;
  }

  getSelectedValues() {
    const selectedValues = this.categories
      .filter(category => category.selected)
      .map(category => category.label);
    this.book_category = selectedValues;
  }

  async submit() {
    try {
      await this.getSelectedValues();
      if(this.release_date == '' || this.language == ''){
        this.message = 'Please fill in complete information.'
        this.notifyfail();
      }
      let res_addbook = await this.bookService.addBooks(this.book_name_th, this.book_name_en, this.book_name_originl, this.book_category, this.book_descriptions, this.book_status,
        this.book_price, this.book_pages, this.base64Image!, this.release_date, Number(this.selectedPublisherId), Number(this.selectedSerie), this.language, Number(this.selectedAuthor));
      if (res_addbook) {
        const bookId = res_addbook.book_id;
        this.setBookIdShopLink(bookId);
        let res_addshop = await this.bookService.addShops(this.links);
        if (res_addshop) {
          this.message = 'Update successful';
          this.notifySucces();
        }
      }
    }
    catch {
      this.message = "Upload failed. Please try again.";
      this.notifyfail();
    }
  }

  shop_book() {
    if (this.numberOfLinks > this.links.length) {
      for (let i = this.links.length; i < this.numberOfLinks; i++) {
          this.links.push({ book_id: '', shop_link: '', shop_detail: '', shop_image: '' });
      }
    } else {
      this.links = this.links.slice(0, this.numberOfLinks);
    }
  }

  setBookIdShopLink(book_id: number) {
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].book_id = book_id.toString();
    }
  }
}
