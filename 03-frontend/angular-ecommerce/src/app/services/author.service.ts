import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Author } from '../common/author';
import { Product } from '../common/product';


@Injectable({
  providedIn: 'root'
})
export class AuthorService {


  private baseUrl = "http://localhost:8080/api/authors";

  constructor(private httpClient: HttpClient) { }

  getAuthorId(theAuthorId: number) : Observable<Author> {

    const getAuthorUrl = `${this.baseUrl}/${theAuthorId}`;

    return this.httpClient.get<Author>(getAuthorUrl);
  }

  getAuthorBooksById(theAuthorId: number) : Observable<Product[]> {

    const getProducAuthortUrl = `${this.baseUrl}/${theAuthorId}/books`;

    return this.httpClient.get<GetResponseAuthorBooks>(getProducAuthortUrl).pipe(
      map( response => response._embedded.products)
    )
  }  

}

interface GetResponseAuthorBooks {
  _embedded: {
    products: Product[];
  }
}
