import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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

  constructor(private formBuilder: FormBuilder, 
              private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {

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
        email: new FormControl('', 
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
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is: " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The shipping address country is: " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is: " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
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
