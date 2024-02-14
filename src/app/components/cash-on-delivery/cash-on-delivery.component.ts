import { Component, OnInit } from '@angular/core';

import { JazzPaymentService } from 'src/app/services/jazz-payment.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cash-on-delivery',
  templateUrl: './cash-on-delivery.component.html',
  styleUrls: ['./cash-on-delivery.component.css']
})
export class CashOnDeliveryComponent implements OnInit {


  ///////////////////////////////////////////////
  select: boolean = true;
  isDisabled: boolean = false;
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

  //Order Tracking Number
  orderTrackingnumber:string = '';
  //////////////////////////////////////////////


  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService, private checkoutService: CheckoutService,
    private cartService: CartServiceService, private jazzPaymentService: JazzPaymentService, private router: Router) {
    
    
  }

  ngOnInit(): void {
    this.checkoutFormWithValidators();
    this.countriesPopulate();
    this.reviewcartDetails();
  }

  public placeCustomerOrder() {

    alert('createChargeMWellet() ');

    if (this.checkoutFormGroup.invalid) {

      this.checkoutFormGroup.markAllAsTouched();
      console.log('Form Data is Valid : ' + this.checkoutFormGroup.valid);
      alert('Form Data is not Valid ');
      return;

    } else {
      alert('createChargeMWellet() else { ');

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
      order.totalPrice = Math.round(this.totalPrice);
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




      // Check Form is Valid
      if (!this.checkoutFormGroup.invalid) {
        
        // Disable Payment Button
        this.isDisabled = true;

        // call REST API using Checkout Service and Place Order, Confirm order Placed Successfully or Error!
        this.checkoutService.placeOrder(purchase).subscribe({
          next: (response: { orderTrackingNumber: string; }) => { this.orderTrackingnumber = response.orderTrackingNumber; alert('Order Placed Successfully \nOrderTrackingNumber :  ' + response.orderTrackingNumber); this.resetCart(); this.isDisabled = false; },
          error: error => { alert("There was an error in Processing Order \nError :  " + error.message); this.isDisabled = false; }

        });

      }

    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

        jazzMobileAccount: this.formBuilder.group(
          {
            //     cardType: [''],
            //     nameOnCard: [''],
            mobileNumber: [''],
            lastSixCnicDigits: ['']
            //     expiryMonth: [''],
            //     expiryYear: ['']
          }
        ),

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

  // Jazz Mobile Account Number Getter
  get mobileNumber() {
    return this.checkoutFormGroup.get('jazzMobileAccount.mobileNumber');
  }

  get lastSixCnicDigits() {
    return this.checkoutFormGroup.get('jazzMobileAccount.lastSixCnicDigits');
  }




  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
