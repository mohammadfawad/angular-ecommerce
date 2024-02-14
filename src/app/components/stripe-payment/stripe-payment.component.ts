import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { throws } from 'assert';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfoStripe } from 'src/app/common/payment-info-stripe';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';
import { environment } from 'src/environments/environment';
//import { Stripe } from 'stripe';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent implements OnInit {


  select: boolean = true;
  isDisabled:boolean = false;
  checkoutFormGroup!: FormGroup;
  cardYears: number[] = [];
  cardMonths: number[] = [];

  //For Shipping in Same Country
  countriesList: Country[] = [];


  //For Shipping And Billing Different Countries
  countriesListShipping: Country[] = [];
  countriesListBilling: Country[] = [];
  stateListShipping: State[] = [];
  stateListBilling: State[] = [];

  //mailformat:string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  mailformat: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  shippingCharges: string | number = 'Free';

  //Browser Session Storage
  browserSessionStoarage: Storage = sessionStorage;


  //Initialize Stripe API : npm install stripe
  //stripe = loadStripe(environment.stripePublishableKey);
  stripe = Stripe(environment.stripePublishableKey);
  
  paymentInfoStripe: PaymentInfoStripe = new PaymentInfoStripe();
  cardElement: any;
  displayError: any;



  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService,
    private cartService: CartServiceService, private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {

    //this.checkoutFormGroup = this.checkoutForm();
    this.checkoutFormWithValidators();
    // this.cardMonthsPopulate();
    // this.cardYearsPopulate();

    //For Shipping in Same Country
    this.countriesPopulate();
    //For Shipping And Billing Different Countries
    //this.countriesPopulateShipping();
    //this.countriesPopulateBilling();

    this.reviewcartDetails();

    // Setup Stripe Payment Form
    this.setupStripePaymentForm();

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////  CHECKOUT FORM      //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////



  userEmail() {
    if (this.browserSessionStoarage.getItem('userEmail') != null) {
      return JSON.parse(this.browserSessionStoarage.getItem('userEmail')!);
    }
  }

  userName() {
    if (this.browserSessionStoarage.getItem('userName') != null) {
      return JSON.parse(this.browserSessionStoarage.getItem('userName')!);
    }
  }

  reviewcartDetails() {
    this.cartService.totalQuantity.subscribe(tQuantity => this.totalQuantity = tQuantity);
    this.cartService.totalPrice.subscribe(tPrice => this.totalPrice = tPrice);
  }

  getStates(formGroupName: string) {
    const shippingAddressFormGroup = this.checkoutFormGroup.get(formGroupName);
    const selectedcountryCode = String(shippingAddressFormGroup?.value.country.code);
    console.log(formGroupName + ' country code : ' + selectedcountryCode);
    this.shopFormService.getStates(selectedcountryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.stateListShipping = data;
        } else {
          this.stateListBilling = data;
        }
      }
    );
  }

  countriesPopulate() {
    this.shopFormService.getCountries().subscribe(
      data => { console.log("Countries List Data :: " + JSON.stringify(data)); this.countriesList = data; }
    );

  }

  // cardMonthsPopulate() {
  //   //month start from 0 
  //   const startMonth = new Date().getMonth() + 1;
  //   this.shopFormService.getCraditCardMonths(startMonth).subscribe(dataMonths => { this.cardMonths = dataMonths });
  // }

  // cardYearsPopulate() {
  //   this.shopFormService.getCarditCardYears().subscribe(dataYears => { this.cardYears = dataYears });
  // }

  handelMonthsAndYears() {
    const currentYear = new Date().getFullYear();
    const craditCardFormGroup = this.checkoutFormGroup.get('craditCard');
    const selectedYear = Number(craditCardFormGroup?.value.expiryYear);
    let startingMonth: number;
    if (currentYear == selectedYear) {
      startingMonth = new Date().getMonth() + 1;
    } else {
      startingMonth = 1;
    }
    this.shopFormService.getCraditCardMonths(startingMonth).subscribe(dataMonths => { this.cardMonths = dataMonths });
  }

  addressShippingBillingSame(event: any) {
    if (event.currentTarget?.checked) {
      this.stateListBilling = this.stateListShipping;

      //this.checkoutFormGroup.get('billingingAddress')?.patchValue(state , this.checkoutFormGroup.get('shippingAddress')?.value.country.state);
      this.checkoutFormGroup.get('billingingAddress')?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
      //console.log('CheckBox : checked');

    } else {
      this.checkoutFormGroup.get('billingingAddress')?.reset();
      //console.log('CheckBox : unChecked');
      this.stateListBilling = [];
    }
  }

  paymentModeSelect(event: any) {
    if (!event.currentTarget.isSelected) {
      this.select = !this.select;

      //alert('this.select = ' + this.select);
    }
  }

  checkoutFormWithValidators() {
    this.checkoutFormGroup = this.formBuilder.group(
      {
        customer: this.formBuilder.group(
          {
            firstName: new FormControl(this.userName(), [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
            lastName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), CheckoutFormValidators.whiteSpacesNotAllowed]),
            email: new FormControl(this.userEmail(), [Validators.required, Validators.pattern(this.mailformat)]),
            contactNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(14), Validators.maxLength(14), CheckoutFormValidators.whiteSpacesNotAllowed]),
          }
        ),

        shippingAddress: this.formBuilder.group(
          {
            country: new FormControl('', [Validators.required]),
            state: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
            street: new FormControl('', [Validators.required, Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
            houseNumber: new FormControl('', [Validators.required, Validators.minLength(1), CheckoutFormValidators.whiteSpacesNotAllowed]),
            contactNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(14), Validators.maxLength(14), CheckoutFormValidators.whiteSpacesNotAllowed]),
            zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9-]*'), Validators.maxLength(12), CheckoutFormValidators.whiteSpacesNotAllowed]),
          }
        ),

        billingingAddress: this.formBuilder.group(
          {
            country: new FormControl('', [Validators.required]),
            state: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
            street: new FormControl('', [Validators.required, Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
            houseNumber: new FormControl('', [Validators.required, Validators.minLength(1), CheckoutFormValidators.whiteSpacesNotAllowed]),
            contactNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(14), Validators.maxLength(14), CheckoutFormValidators.whiteSpacesNotAllowed]),
            zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9-]*'), Validators.maxLength(12), CheckoutFormValidators.whiteSpacesNotAllowed]),
          }
        ),

        // craditCard: this.formBuilder.group(
        //   {
        //     cardType: new FormControl('', [Validators.required]),
        //     nameOnCard: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
        //     cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), Validators.minLength(16), Validators.maxLength(16), CheckoutFormValidators.whiteSpacesNotAllowed]),
        //     securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'), Validators.minLength(3), Validators.maxLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
        //     expiryMonth: new FormControl('', [Validators.required]),
        //     expiryYear: new FormControl('', [Validators.required]),
        //   }
        // ),

        reviewOrder: this.formBuilder.group(
          {
            totalQuantity: [''],
            shippingCharges: [''],
            totalPrice: ['']
          }
        )
      }
    );
  }

  checkoutForm() {
    return this.formBuilder.group(
      {
        customer: this.formBuilder.group(
          {
            firstName: [''],
            lastName: [''],
            email: [''],
            contactNumber: ['']
          }
        ),

        shippingAddress: this.formBuilder.group(
          {
            country: [''],
            state: [''],
            city: [''],
            street: [''],
            houseNumber: [''],
            contactNumber: [''],
            zipCode: ['']
          }
        ),

        billingingAddress: this.formBuilder.group(
          {
            country: [''],
            state: [''],
            city: [''],
            street: [''],
            houseNumber: [''],
            contactNumber: [''],
            zipCode: ['']
          }
        ),

        // craditCard: this.formBuilder.group(
        //   {
        //     cardType: [''],
        //     nameOnCard: [''],
        //     cardNumber: [''],
        //     securityCode: [''],
        //     expiryMonth: [''],
        //     expiryYear: ['']
        //   }
        // ),

        reviewOrder: this.formBuilder.group(
          {
            totalQuantity: [''],
            shippingCharges: [''],
            totalPrice: ['']
          }
        )
      }
    );
  }



  resetCart() {
    //Reset the Cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItemsToBrowserStorage();

    //Reset the Form
    this.checkoutFormGroup.reset();

    //Nevigate Back to Products
    this.router.navigateByUrl("/products");
  }

  //Customer Getter Methods
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get contactNumber() {
    return this.checkoutFormGroup.get('customer.contactNumber');
  }

  // ShippingAddress Getter Methods
  get countryShipping() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get stateShipping() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get cityShipping() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get streetShipping() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get houseNumberShipping() {
    return this.checkoutFormGroup.get('shippingAddress.houseNumber');
  }
  get contactNumberShipping() {
    return this.checkoutFormGroup.get('shippingAddress.contactNumber');
  }
  get zipCodeShipping() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  // BillingAddress Getter Methods
  get countryBilling() {
    return this.checkoutFormGroup.get('billingingAddress.country');
  }
  get stateBilling() {
    return this.checkoutFormGroup.get('billingingAddress.state');
  }
  get cityBilling() {
    return this.checkoutFormGroup.get('billingingAddress.city');
  }
  get streetBilling() {
    return this.checkoutFormGroup.get('billingingAddress.street');
  }
  get houseNumberBilling() {
    return this.checkoutFormGroup.get('billingingAddress.houseNumber');
  }
  get contactNumberBilling() {
    return this.checkoutFormGroup.get('billingingAddress.contactNumber');
  }
  get zipCodeBilling() {
    return this.checkoutFormGroup.get('billingingAddress.zipCode');
  }

  //craditCard Getter Methods
  // get cardType() {
  //   return this.checkoutFormGroup.get('craditCard.cardType');
  // }
  // get nameOnCard() {
  //   return this.checkoutFormGroup.get('craditCard.nameOnCard');
  // }
  // get cardNumber() {
  //   return this.checkoutFormGroup.get('craditCard.cardNumber');
  // }
  // get securityCode() {
  //   return this.checkoutFormGroup.get('craditCard.securityCode');
  // }
  // get expiryMonth() {
  //   return this.checkoutFormGroup.get('craditCard.expiryMonth');
  // }
  // get expiryYear() {
  //   return this.checkoutFormGroup.get('craditCard.expiryYear');
  // }



  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////   CHECKOUT FORM    //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////




  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////// STRIP CARD PAYMENT //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  setupStripePaymentForm() {

    // Get a handel to stripe Elements
    var elements = this.stripe.elements();

    // Create Card element and hide zip code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // add instance of Card UI component into (card-element) div
    this.cardElement.mount('#card-element');

    // Add event binding for 'Change' on Card element
    this.cardElement.on('change', (event:any) => {
      // Get handel to card errors 
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });

  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {

      this.checkoutFormGroup.markAllAsTouched();
      console.log('Form Data is Valid : ' + this.checkoutFormGroup.valid);
      alert('Form Data is not Valid ');
      return;

    } else {


      ////////////////////////////////////////////////////////
      //################## LOG INFORMATION START ##########//
      //////////////////////////////////////////////////////
      console.log('------------- Customer Form Data Start--------------');
      console.log(this.checkoutFormGroup.get('customer')?.value);
      console.log(this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
      console.log(this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
      //console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
      console.log(this.checkoutFormGroup.get('billingingAddress')?.value.country.name);
      console.log(this.checkoutFormGroup.get('billingingAddress')?.value.state.name);
      //console.log(this.checkoutFormGroup.get('billingingAddress')?.value);
      console.log(this.checkoutFormGroup.get('craditCard')?.value);
      console.log(this.checkoutFormGroup.get('reviewOrder')?.value);
      console.log('------------- Customer Form Data End--------------');

      ////////////////////////////////////////////////////////
      //################## LOG INFORMATION START ##########//
      //////////////////////////////////////////////////////

      //Set Order
      let order = new Order();
      order.totalPrice = this.totalPrice;
      order.totalQuantity = this.totalQuantity;

      //Get Cart Items
      const cartItems = this.cartService.cartItems;

      //Create OrderItems from CartItems

      let orderItems: OrderItem[] = [];

      //Method 1 : 
      //cartItems.forEach(cartItem => orderItems.push(new OrderItem(cartItem)));

      //Method 2 : 
      orderItems = cartItems.map(cartItem => new OrderItem(cartItem));

      //Set Purchase
      let purchase = new Purchase();

      //Initialize Customer
      purchase.customer = this.checkoutFormGroup.controls['customer'].value;

      //Initialize ShippingAddress
      purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value; alert(JSON.stringify(purchase.shippingAddress?.country));
      const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
      const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
      purchase.shippingAddress!.state = shippingState.name;
      purchase.shippingAddress!.country = shippingCountry.name;

      //Initialize BillingAddress
      purchase.billingAddress = this.checkoutFormGroup.controls['billingingAddress'].value;
      const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
      const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
      purchase.billingAddress!.state = billingState.name;
      purchase.billingAddress!.country = billingCountry.name;

      //Initialize Order and OrderItems
      purchase.order = order;
      purchase.orderItems = orderItems;


      // Data will be directly sent to Stripe server
      /////////////////////////////////////////// STRIP CARD PAYMENT //////////////////////////////////////////
      // Compute Payment Infomation From Checkout: totalPrice : amount will be deducted using cents, 1 dollar | Rupee = 100 cents | Passa

      this.paymentInfoStripe.amount = Math.round(this.totalPrice * 100);
      this.paymentInfoStripe.currency = "USD";
      this.paymentInfoStripe.receiptEmail = purchase.customer?.email;

      // Check Form is Valid
      if(this.checkoutFormGroup.invalid && this.displayError.textContent ===""){
        // Disable Payment Button
        this.isDisabled = true;

        // Create Payment Intent
        this.checkoutService.createPaymentIntentStripe(this.paymentInfoStripe).subscribe(
          (paymentIntentStripeResponse) => {
            this.stripe.confirmCardPayment(paymentIntentStripeResponse.client_secret, { payment_method: { card: this.cardElement, 
                                                                                        billing_details:{ email: purchase.customer?.email, 
                                                                                                          name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
                                                                                                          address:{line1:purchase.billingAddress?.street,
                                                                                                                    city:purchase.billingAddress?.city, 
                                                                                                                    state:purchase.billingAddress?.state, 
                                                                                                                    postal_code:purchase.billingAddress?.zipCode,
                                                                                                                    country:purchase.billingAddress?.country }}} }, { handleActions: false  } ).then(
              (result: any) => {
                if (result.error) {
                  // Inform customer about error
                  alert(`There was an error : ${result.error.message}`);
                  // Enable Payment Button in error case
                  this.isDisabled = false;
                } else {
                  // call REST API using Checkout Service and Place Order, Confirm order Placed Successfully or Error!
                  this.checkoutService.placeOrder(purchase).subscribe({
                    next: (response: { orderTrackingNumber: string; }) => { alert('Order Placed Successfully \nOrderTrackingNumber :  ' + response.orderTrackingNumber); this.resetCart(); this.isDisabled=false;},
                    error: error => { alert("There was an error in Processing Order \nError :  " + error.message); this.isDisabled=false;}
  
                  });
                }
              }
            );
          }
        );
      }else{
        this.checkoutFormGroup.markAllAsTouched();
        return;
      }


      /////////////////////////////////////////// STRIP CARD PAYMENT //////////////////////////////////////////


      //Use Checkout Service to save Order
      this.checkoutService.placeOrder(purchase).subscribe(
        {
          next: response => { alert('Order Placed Successfully \nOrderTrackingNumber :  ' + response.orderTrackingNumber); this.resetCart(); },
          error: error => { alert("There was an error in Processing Order \nError :  " + error.message); }
        }
      );


      console.log(JSON.stringify(purchase));

    }

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////// STRIP CARD PAYMENT //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

}
function loadStripe(stripePublishableKey: string) {
  throw new Error('Function not implemented.');
}

