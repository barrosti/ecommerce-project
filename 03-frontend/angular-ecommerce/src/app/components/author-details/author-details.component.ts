import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Author } from 'src/app/common/author';
import { Product } from 'src/app/common/product';
import { AuthorService } from 'src/app/services/author.service';


@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.css']
})
export class AuthorDetailsComponent implements OnInit {

  author: Author = new Author();
  //products: Product[] = [];

  constructor(private authorService: AuthorService,
    
    private route: ActivatedRoute) {}

     ngOnInit(): void {
      this.route.paramMap.subscribe(() => {
        this.handleProductDetails();
      })
    }
    
    handleProductDetails() {
      // get the "id" param string and convert to a number using operator "+"
      const theAuthorId: number = +this.route.snapshot.paramMap.get('id')!;

      // get Author
      this.authorService.getAuthorId(theAuthorId).subscribe(
        data => {
          console.log('Author Detail=' + JSON.stringify(data));
          this.author = data;
        }
      )

    // get books
    this.authorService.getAuthorBooksById(theAuthorId).subscribe(
      data => {        
        this.author.products = data;
      }
    )      
  
    }

}
