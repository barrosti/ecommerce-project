import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;
  private KEY_STORAGE_EMAIL: string = 'userEmailStorage';

  constructor(private formBuilder: FormBuilder, 
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    // read the user's email address from browser storage
    const emailJson = this.storage.getItem(this.KEY_STORAGE_EMAIL);
    const theEmail = emailJson != null ? JSON.parse(emailJson) : '';

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2), 
                                   Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', 
                                  [Validators.required, 
                                   Validators.minLength(2), 
                                   Luv2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl(theEmail, 
                                  [Validators.required, 
                                   Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                [ Validators.required, 
                                  Validators.minLength(2), 
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [ Validators.required]),
        country: new FormControl('', [ Validators.required]),
        zipcode: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                [ Validators.required, 
                                  Validators.minLength(2), 
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [ Validators.required]),
        country: new FormControl('', [ Validators.required]),
        zipcode: new FormControl('', 
                              [ Validators.required, 
                                Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [ Validators.required]),
        nameOnCard: new FormControl('', 
                                  [ Validators.required, 
                                    Validators.minLength(2), 
                                   Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber:  new FormControl('', 
                                    [Validators.required, 
                                     Validators.pattern('[0-9]{16}')]),
        securityCode:   new FormControl('', 
                                      [Validators.required, 
                                      Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
      
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1; // + 1 => the month is 0 based
    console.log("startMonth: " + startMonth );
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months from service: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years from service: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate Countries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved Countries from service: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }

  reviewCartDetails() {
    // subscribe to cartService for totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity            
    );

    // subscribe to cartService for totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );    
  }

  // form: Customer 
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName') }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName') }
  get email(){ return this.checkoutFormGroup.get('customer.email') }

  // form: Shipping Address
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city') }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state') }
  get shippingAddressZipcode(){ return this.checkoutFormGroup.get('shippingAddress.zipcode') }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country') }

  // form: Billing Address
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street') }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city') }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state') }
  get billingAddressZipcode(){ return this.checkoutFormGroup.get('billingAddress.zipcode') }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country') }  

  //form: Credit Card
  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType') }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get creditCardCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode') }

  copyShippingToBillingAddress(event: Event){
    const ischecked = (<HTMLInputElement>event.target).checked;
    if(ischecked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    console.log("Handling the submit button purchase");

    if( this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const carItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for(let i=0; i < carItems.length; i++){
      orderItems[i] = new OrderItem(carItems[i]);
    }
    */

    // - short way
    let orderItems: OrderItem[] = carItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);    

    // reset form data
    this.checkoutFormGroup.reset();

    // clear cart content from localstorage
    localStorage.clear();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {

    const creditCardGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardGroup?.value.expirationYear);

    // if the current year equals to the selected year
    // then start with current month

    let startMonth: number = 1;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1; // + 1 beacuse month is 0 based
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credt card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(theFormGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(theFormGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${theFormGroupName} country code: ${countryCode}`);
    console.log(`${theFormGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(theFormGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        } else if(theFormGroupName === 'billingAddress'){
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);

      }
    );

  }

}
