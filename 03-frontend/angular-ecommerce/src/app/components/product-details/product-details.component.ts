import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Author } from 'src/app/common/author';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  
  handleProductDetails() {
    // get the "id" param string and convert to a number using operator "+"
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(theProductId).subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.product = data;
      }
    )

    // get authors
    this.productService.getProductAuthorsById(theProductId).subscribe(
      data => {
        console.log('Product Authors=' + JSON.stringify(data));
        this.product.authors = data;
      }
    )
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
    
  }

}
