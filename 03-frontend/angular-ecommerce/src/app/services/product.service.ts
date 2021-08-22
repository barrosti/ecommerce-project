import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { Author } from '../common/author';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);

  }  

  getProductListPaginate(thePage: number, 
                          thePageSize: number, 
                          theCategoryId: number): Observable<GetResponseProducts> {

    // build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    // need to build URL base on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }  


  getProductById(theProductId: number) : Observable<Product> {

    const getProductUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(getProductUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }  

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductsCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProductAuthorsById(theProductId: number) : Observable<Author[]> {

    const getProducAuthortUrl = `${this.baseUrl}/${theProductId}/authors`;

    return this.httpClient.get<GetResponseProductsAuthor>(getProducAuthortUrl).pipe(
      map( response => response._embedded.authors)
    )
  }  

}


interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductsCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

interface GetResponseProductsAuthor {
  _embedded: {
    authors: Author[];
  }
}