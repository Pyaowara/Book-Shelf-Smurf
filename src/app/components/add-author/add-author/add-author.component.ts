import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book-service/book.service';

@Component({
  selector: 'app-add-author',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-author.component.html',
  styleUrl: './add-author.component.scss'
})
export class AddAuthorComponent {
  constructor(private bookService: BookService){}

  base64Image: string | null = null;
  author_name:string = '';
  author_description:string = '';
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

  async submit(){
    if(this.author_name == ''){
      this.message = 'Please fill in all information.';
      return;
    }
    let res = await this.bookService.addAuthor(this.author_name, this.base64Image!, this.author_description);
    this.message = res.message;
    this.notify();
  }

  notify(){
    alert(this.message);
    this.reset();
  }

  reset(){
    this.base64Image = null;
    this.author_name= '';
    this.author_description= '';
    this.message= '';
  }
}
