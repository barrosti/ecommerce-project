import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AuthorDetailsComponent } from './components/author-details/author-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';

const routes : Routes = [
  {path: 'cart-details', component: CartDetailsComponent },  
  {path: 'author/:id', component: AuthorDetailsComponent },  
  {path: 'products/:id', component: ProductDetailsComponent },
  {path: 'search/:keyword', component: ProductListComponent },
  {path: 'category/:id/:name', component: ProductListComponent },
  {path: 'category', component: ProductListComponent },
  {path: 'products', component: ProductListComponent },
  
  // - default
  {path: '', redirectTo: '/products', pathMatch: 'full' },
  // - if none of above was found
  {path: '**', redirectTo: '/products', pathMatch: 'full' }
] ;

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    AuthorDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
