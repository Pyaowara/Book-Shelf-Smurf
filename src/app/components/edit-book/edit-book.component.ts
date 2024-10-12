import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book-service/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user_service/user.service';


@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss'
})
export class EditBookComponent implements OnInit {
  constructor(private bookService: BookService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) { }
  
  userData:any;
  book: any;
  bookId: string | null = '';
  shop: any;
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
  language: string = '';
  message: string = '';
  numberOfLinks: number = 0;
  links: { book_id: string, shop_link: string, shop_detail: string, shop_image: string }[] = [];
  publisher_all: { publisher_id: string, publisher_name: string, publisher_image: string }[] = [];
  serie_all: { serie_id: string, serie_name_th: string, serie_name_en: string, serie_name_original: string, serie_status: string, serie_detail: string }[] = [];
  author_all: {author_id:string, author_name:string, author_description:string, author_image:string}[] = [];
  noti_succes:boolean = false;
  noti_fail:boolean = false;

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

  async ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.publisher_all = await this.bookService.getPublisher();
    this.author_all = await this.bookService.getAuthor();
    this.serie_all = await this.bookService.getSerie();
    this.book = await this.bookService.getBookById(this.bookId);
    this.shop = await this.bookService.getShop(this.bookId);
    this.links = this.shop;
    this.numberOfLinks = this.shop.length;
    this.userData = await this.userService.getData();
    if(this.userData.user_permission == 'Publisher'){
      if(this.book.publisher.publisher_id != this.userData.publisher_id){
        await this.router.navigate(['booklist']);
        alert("You don't have access rights!!");
      }
    }
    this.loadData();
    if(this.userData?.publisher_id != null){
      this.selectedPublisherId = this.userData?.publisher_id;
    }
  }

  loadData() {
    this.book_name_th = this.book.book_name_th;
    this.book_name_en = this.book.book_name_en;
    this.book_name_originl = this.book.book_name_originl;
    this.book_descriptions = this.book.book_descriptions;
    this.book_status = this.book.book_status;
    this.base64Image = this.book.book_image;
    this.book_price = this.book.book_price;
    this.book_pages = this.book.book_pages;
    this.language = this.book.language;
    this.selectedPublisherId = this.book.publisher.publisher_id;
    this.selectedSerie = this.book.serie.serie_id;
    this.release_date = this.book.release_date;
    this.selectedAuthor = this.book.author.author_id;
    this.checkcategoey();
  }

  checkcategoey() {
    for (const index in this.categories) {
      const category = this.categories[index]
      if (this.book.book_category.includes(category.label)) {
        category.selected = true;
      }
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
      this.bookId = await this.route.snapshot.paramMap.get('id');
      let res_update = await this.bookService.updateBooks(this.bookId, this.book_name_th, this.book_name_en, this.book_name_originl, this.book_category, this.book_descriptions, this.book_status,
        this.book_price, this.book_pages, this.base64Image!, this.release_date, Number(this.selectedPublisherId), Number(this.selectedSerie), this.language, Number(this.selectedAuthor));
      if (res_update) {
        const bookId = res_update.book_id;
        this.setBookIdShopLink(bookId);
        let res_addshop = await this.bookService.addShops(this.links);
        if (res_addshop) {
          this.message = res_addshop.message;
          this.notifySucces();
        }
      }
      this.message = 'Update book sucess';
      this.router.navigate(['book/'+this.bookId]);
    }
    catch{
      this.message = 'Update book faill';
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
