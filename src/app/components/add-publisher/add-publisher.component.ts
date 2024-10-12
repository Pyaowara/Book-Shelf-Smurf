import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book-service/book.service';

@Component({
  selector: 'app-add-publisher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-publisher.component.html',
  styleUrl: './add-publisher.component.scss'
})
export class AddPublisherComponent {
  constructor(private bookService: BookService){}

  base64Image: string | null = null;
  publisher_name:string = '';
  message:string = '';
  noti_succes:boolean = false;
  noti_fail:boolean = false;

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

  notifySucces(){
    this.noti_succes = true;
    this.noti_fail = false;
  }

  notifyfail(){
    this.noti_fail = true;
    this.noti_succes = false;
  }

  async submit(){
    if(this.publisher_name == ''){
      this.message = 'Please fill in all information.';
      this.notifyfail()
      return;
    }
    let res = await this.bookService.addPublisher(this.publisher_name, this.base64Image!);
    this.message = res.message;
    this.notifySucces();
  }
}
