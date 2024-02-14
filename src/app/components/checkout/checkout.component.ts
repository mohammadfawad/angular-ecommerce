import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Form, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';

import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  //totalPrice: number = 0.00;
  totalQuantity: number = 0;
  //shippingCharges: string | number = 'Free';

  paymentMethodSelected:string = '';

  constructor(private cartService:CartServiceService){}

  ngOnInit(): void {
    this.reviewcartDetails();
  }

  selectPayMode(event:any){
    if (event.currentTarget?.checked) {
       
        if(event.currentTarget?.value.toString() === 'cashOnDelivery'){
            // alert('cashOnDelivery');
            this.paymentMethodSelected = 'cashOnDelivery';

        }else if(event.currentTarget?.value.toString() === 'jazzCashMwellet'){
            // alert('jazzCashMwellet');
            this.paymentMethodSelected = 'jazzCashMwellet'; 

        }else if(event.currentTarget?.value.toString() === 'stripe'){
            // alert('stripe');
            this.paymentMethodSelected = 'stripe';
        }
    }
  }

  // select: boolean = true;
  // checkoutFormGroup!: FormGroup;
  // cardYears: number[] = [];
  // cardMonths: number[] = [];

  // //For Shipping in Same Country
  // countriesList: Country[] = [];


  // //For Shipping And Billing Different Countries
  // countriesListShipping: Country[] = [];
  // countriesListBilling: Country[] = [];
  // stateListShipping: State[] = [];
  // stateListBilling: State[] = [];

  // //mailformat:string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // mailformat: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  // totalPrice: number = 0.00;
  // totalQuantity: number = 0;
  // shippingCharges: string | number = 'Free';

  // //Browser Session Storage
  // browserSessionStoarage: Storage = sessionStorage;

  // constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService, 
  //   private cartService: CartServiceService, private checkoutService: CheckoutService, private router: Router) { }

  // ngOnInit(): void {
  //   //this.checkoutFormGroup = this.checkoutForm();
  //   this.checkoutFormWithValidators();
  //   this.cardMonthsPopulate();
  //   this.cardYearsPopulate();

  //   //For Shipping in Same Country
  //   this.countriesPopulate();
  //   //For Shipping And Billing Different Countries
  //   //this.countriesPopulateShipping();
  //   //this.countriesPopulateBilling();

  //   this.reviewcartDetails();
  // }

  // userEmail(){
  //   if(this.browserSessionStoarage.getItem('userEmail') != null){
  //     return JSON.parse(this.browserSessionStoarage.getItem('userEmail')!) ;
  //   }
  // }

  // userName(){
  //   if(this.browserSessionStoarage.getItem('userName') != null){
  //     return JSON.parse(this.browserSessionStoarage.getItem('userName')!) ;
  //   }
  // }

  reviewcartDetails() {
    this.cartService.totalQuantity.subscribe(tQuantity => this.totalQuantity = tQuantity);
    //this.cartService.totalPrice.subscribe(tPrice => this.totalPrice = tPrice);
  }

  // getStates(formGroupName: string) {
  //   const shippingAddressFormGroup = this.checkoutFormGroup.get(formGroupName);
  //   const selectedcountryCode = String(shippingAddressFormGroup?.value.country.code);
  //   console.log(formGroupName + ' country code : ' + selectedcountryCode);
  //   this.shopFormService.getStates(selectedcountryCode).subscribe(
  //     data => {
  //       if (formGroupName === 'shippingAddress') {
  //         this.stateListShipping = data;
  //       } else {
  //         this.stateListBilling = data;
  //       }
  //     }
  //   );
  // }

  // countriesPopulate() {
  //   this.shopFormService.getCountries().subscribe(
  //     data => { console.log("Countries List Data :: " + JSON.stringify(data)); this.countriesList = data; }
  //   );

  // }

  // cardMonthsPopulate() {
  //   //month start from 0 
  //   const startMonth = new Date().getMonth() + 1;
  //   this.shopFormService.getCraditCardMonths(startMonth).subscribe(dataMonths => { this.cardMonths = dataMonths });
  // }

  // cardYearsPopulate() {
  //   this.shopFormService.getCarditCardYears().subscribe(dataYears => { this.cardYears = dataYears });
  // }

  // handelMonthsAndYears() {
  //   const currentYear = new Date().getFullYear();
  //   const craditCardFormGroup = this.checkoutFormGroup.get('craditCard');
  //   const selectedYear = Number(craditCardFormGroup?.value.expiryYear);
  //   let startingMonth: number;
  //   if (currentYear == selectedYear) {
  //     startingMonth = new Date().getMonth() + 1;
  //   } else {
  //     startingMonth = 1;
  //   }
  //   this.shopFormService.getCraditCardMonths(startingMonth).subscribe(dataMonths => { this.cardMonths = dataMonths });
  // }

  // addressShippingBillingSame(event: any) {
  //   if (event.currentTarget?.checked) {
  //     this.stateListBilling = this.stateListShipping;

  //     //this.checkoutFormGroup.get('billingingAddress')?.patchValue(state , this.checkoutFormGroup.get('shippingAddress')?.value.country.state);
  //     this.checkoutFormGroup.get('billingingAddress')?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
  //     //console.log('CheckBox : checked');

  //   } else {
  //     this.checkoutFormGroup.get('billingingAddress')?.reset();
  //     //console.log('CheckBox : unChecked');
  //     this.stateListBilling = [];
  //   }
  // }

  // paymentModeSelect(event: any) {
  //   if (!event.currentTarget.isSelected) {
  //     this.select = !this.select;

  //     //alert('this.select = ' + this.select);
  //   }
  // }

  // checkoutFormWithValidators() {
  //   this.checkoutFormGroup = this.formBuilder.group(
  //     {
  //       customer: this.formBuilder.group(
  //         {
  //           firstName: new FormControl(this.userName(), [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           lastName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           email: new FormControl(this.userEmail(), [Validators.required, Validators.pattern(this.mailformat)]),
  //           contactNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(14), Validators.maxLength(14), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //         }
  //       ),

  //       shippingAddress: this.formBuilder.group(
  //         {
  //           country: new FormControl('', [Validators.required]),
  //           state: new FormControl('', [Validators.required]),
  //           city: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           street: new FormControl('', [Validators.required, Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           houseNumber: new FormControl('', [Validators.required, Validators.minLength(1), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           contactNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(14), Validators.maxLength(14), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9-]*'), Validators.maxLength(12), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //         }
  //       ),

  //       billingingAddress: this.formBuilder.group(
  //         {
  //           country: new FormControl('', [Validators.required]),
  //           state: new FormControl('', [Validators.required]),
  //           city: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           street: new FormControl('', [Validators.required, Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           houseNumber: new FormControl('', [Validators.required, Validators.minLength(1), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           contactNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(14), Validators.maxLength(14), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9-]*'), Validators.maxLength(12), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //         }
  //       ),

  //       craditCard: this.formBuilder.group(
  //         {
  //           cardType: new FormControl('', [Validators.required]),
  //           nameOnCard: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), Validators.minLength(16), Validators.maxLength(16), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'), Validators.minLength(3), Validators.maxLength(3), CheckoutFormValidators.whiteSpacesNotAllowed]),
  //           expiryMonth: new FormControl('', [Validators.required]),
  //           expiryYear: new FormControl('', [Validators.required]),
  //         }
  //       ),

  //       reviewOrder: this.formBuilder.group(
  //         {
  //           totalQuantity: [''],
  //           shippingCharges: [''],
  //           totalPrice: ['']
  //         }
  //       )
  //     }
  //   );
  // }

  // checkoutForm() {
  //   return this.formBuilder.group(
  //     {
  //       customer: this.formBuilder.group(
  //         {
  //           firstName: [''],
  //           lastName: [''],
  //           email: [''],
  //           contactNumber: ['']
  //         }
  //       ),

  //       shippingAddress: this.formBuilder.group(
  //         {
  //           country: [''],
  //           state: [''],
  //           city: [''],
  //           street: [''],
  //           houseNumber: [''],
  //           contactNumber: [''],
  //           zipCode: ['']
  //         }
  //       ),

  //       billingingAddress: this.formBuilder.group(
  //         {
  //           country: [''],
  //           state: [''],
  //           city: [''],
  //           street: [''],
  //           houseNumber: [''],
  //           contactNumber: [''],
  //           zipCode: ['']
  //         }
  //       ),

  //       craditCard: this.formBuilder.group(
  //         {
  //           cardType: [''],
  //           nameOnCard: [''],
  //           cardNumber: [''],
  //           securityCode: [''],
  //           expiryMonth: [''],
  //           expiryYear: ['']
  //         }
  //       ),

  //       reviewOrder: this.formBuilder.group(
  //         {
  //           totalQuantity: [''],
  //           shippingCharges: [''],
  //           totalPrice: ['']
  //         }
  //       )
  //     }
  //   );
  // }

  // onSubmit() {
   
  //   if (this.checkoutFormGroup.invalid) {

  //     this.checkoutFormGroup.markAllAsTouched();
  //     console.log('Form Data is Valid : ' + this.checkoutFormGroup.valid);
  //     alert('Form Data is not Valid ');
  //     return;

  //    } 
  //    //else {
  //   //   //Cash on Delivery
  //   //   if (this.select === false) {

  //   //     this.checkoutFormGroup.get('craditCard')?.reset();
  //   //     this.checkoutFormGroup.get('craditCard')?.disable();

  //   //   } 
  //   else { 

  //       //this.checkoutFormGroup.get('craditCard')?.enable(); 

  //     ////////////////////////////////////////////////////////
  //     //################## LOG INFORMATION START ##########//
  //     //////////////////////////////////////////////////////
  //     console.log('------------- Customer Form Data Start--------------');
  //     console.log(this.checkoutFormGroup.get('customer')?.value);
  //     console.log(this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
  //     console.log(this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
  //     //console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
  //     console.log(this.checkoutFormGroup.get('billingingAddress')?.value.country.name);
  //     console.log(this.checkoutFormGroup.get('billingingAddress')?.value.state.name);
  //     //console.log(this.checkoutFormGroup.get('billingingAddress')?.value);
  //     console.log(this.checkoutFormGroup.get('craditCard')?.value);
  //     console.log(this.checkoutFormGroup.get('reviewOrder')?.value);
  //     console.log('------------- Customer Form Data End--------------');

  //     ////////////////////////////////////////////////////////
  //     //################## LOG INFORMATION START ##########//
  //     //////////////////////////////////////////////////////

  //       //Set Order
  //       let order = new Order();
  //       order.totalPrice = this.totalPrice;
  //       order.totalQuantity = this.totalQuantity;

  //       //Get Cart Items
  //       const cartItems = this.cartService.cartItems;

  //       //Create OrderItems from CartItems
        
  //       let orderItems: OrderItem[] = [];

  //       //Method 1 : 
  //       cartItems.forEach(cartItem => orderItems.push( new OrderItem(cartItem) ));

  //       //Method 2 : 
  //       orderItems = cartItems.map(cartItem => new OrderItem(cartItem));
        
  //       //Set Purchase
  //       let purchase = new Purchase();

  //       //Initialize Customer
  //       purchase.customer = this.checkoutFormGroup.controls['customer'].value;

  //       //Initialize ShippingAddress
  //       purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value; alert(JSON.stringify(purchase.shippingAddress?.country));
  //       const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
  //       const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
  //       purchase.shippingAddress!.state = shippingState.name;
  //       purchase.shippingAddress!.country = shippingCountry.name;

  //       //Initialize BillingAddress
  //       purchase.billingAddress = this.checkoutFormGroup.controls['billingingAddress'].value;
  //       const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
  //       const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
  //       purchase.billingAddress!.state = billingState.name;
  //       purchase.billingAddress!.country = billingCountry.name;

  //       //Initialize Order and OrderItems
  //       purchase.order = order;
  //       purchase.orderItems = orderItems;

  //       //Use Checkout Service to save Order
  //       this.checkoutService.placeOrder(purchase).subscribe(
  //        {
  //         next: response => { alert('Order Placed Successfully \nOrderTrackingNumber :  ' + response.orderTrackingNumber); this.resetCart(); },
  //         error: error => { alert("There was an error in Processing Order \nError :  " + error.message); }
  //       }
  //       );


  //       console.log(JSON.stringify(purchase));

  //   }

  // }

  // resetCart(){
  //   //Reset the Cart
  //   this.cartService.cartItems = [];
  //   this.cartService.totalPrice.next(0);
  //   this.cartService.totalQuantity.next(0);

  //   //Reset the Form
  //   this.checkoutFormGroup.reset();

  //   //Nevigate Back to Products
  //   this.router.navigateByUrl("/products");
  // }

  // //Customer Getter Methods
  // get firstName() {
  //   return this.checkoutFormGroup.get('customer.firstName');
  // }

  // get lastName() {
  //   return this.checkoutFormGroup.get('customer.lastName');
  // }

  // get email() {
  //   return this.checkoutFormGroup.get('customer.email');
  // }

  // get contactNumber() {
  //   return this.checkoutFormGroup.get('customer.contactNumber');
  // }

  // // ShippingAddress Getter Methods
  // get countryShipping() {
  //   return this.checkoutFormGroup.get('shippingAddress.country');
  // }
  // get stateShipping() {
  //   return this.checkoutFormGroup.get('shippingAddress.state');
  // }
  // get cityShipping() {
  //   return this.checkoutFormGroup.get('shippingAddress.city');
  // }
  // get streetShipping() {
  //   return this.checkoutFormGroup.get('shippingAddress.street');
  // }
  // get houseNumberShipping() {
  //   return this.checkoutFormGroup.get('shippingAddress.houseNumber');
  // }
  // get contactNumberShipping() {
  //   return this.checkoutFormGroup.get('shippingAddress.contactNumber');
  // }
  // get zipCodeShipping() {
  //   return this.checkoutFormGroup.get('shippingAddress.zipCode');
  // }

  // // BillingAddress Getter Methods
  // get countryBilling() {
  //   return this.checkoutFormGroup.get('billingingAddress.country');
  // }
  // get stateBilling() {
  //   return this.checkoutFormGroup.get('billingingAddress.state');
  // }
  // get cityBilling() {
  //   return this.checkoutFormGroup.get('billingingAddress.city');
  // }
  // get streetBilling() {
  //   return this.checkoutFormGroup.get('billingingAddress.street');
  // }
  // get houseNumberBilling() {
  //   return this.checkoutFormGroup.get('billingingAddress.houseNumber');
  // }
  // get contactNumberBilling() {
  //   return this.checkoutFormGroup.get('billingingAddress.contactNumber');
  // }
  // get zipCodeBilling() {
  //   return this.checkoutFormGroup.get('billingingAddress.zipCode');
  // }

  // //craditCard Getter Methods
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



  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // //*************************  IF SHIPPING AND BILLING COUNTRIES ARE DIFFERENT START ***********************************/
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // updateShippingcountrySelected(address: string) {
  //   const shippingAddressFormGroup = this.checkoutFormGroup.get('shippingAddress');
  //   const selectedcountry = String(shippingAddressFormGroup?.value.country);

  //   if (selectedcountry == 'Countries List') {
  //     alert("Selected is not a Country : " + selectedcountry);
  //   } else {
  //     this.countriesListShipping.forEach(
  //       element => {
  //         if (element.name == selectedcountry) {

  //           const countCodeShipping: string = element.code;
  //           this.satesPopulateShipping(countCodeShipping);
  //           alert(countCodeShipping);

  //         }
  //       }
  //     );
  //   }
  // }

  // updateBillingcountrySelected(event: any) {
  //   const shippingAddressFormGroup = this.checkoutFormGroup.get('billingingAddress');
  //   const selectedcountry = String(shippingAddressFormGroup?.value.country);

  //   if (selectedcountry == 'Countries List') {
  //     alert("Selected is not a Country : " + selectedcountry);
  //   } else {
  //     this.countriesListBilling.forEach(
  //       element => {
  //         if (element.name == selectedcountry) {

  //           const countCodeBilling: string = element.code;
  //           this.satesPopulateBilling(countCodeBilling);
  //           alert(countCodeBilling);

  //         }
  //       }
  //     );
  //   }
  // }

  // countriesPopulateShipping() {
  //   this.shopFormService.getCountries().subscribe(
  //     data => { console.log("Countries List Data :: " + JSON.stringify(data)); this.countriesListShipping = data; }
  //   );

  // }

  // countriesPopulateBilling() {
  //   this.shopFormService.getCountries().subscribe(
  //     data => { console.log("Countries List Data :: " + JSON.stringify(data)); this.countriesListBilling = data; }
  //   );

  // }

  // satesPopulateShipping(countryCode: string) {

  //   return this.shopFormService.getStates(countryCode).subscribe(data => this.stateListShipping = data);
  // }

  // satesPopulateBilling(countryCode: string) {

  //   return this.shopFormService.getStates(countryCode).subscribe(data => this.stateListBilling = data);
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //*************************  IF SHIPPING AND BILLING COUNTRIES ARE DIFFERENT END *************************************/
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}















///// HTML////////////////


/*


<div class="main-content page-m">
    <div class="section-content section-content-p30">
      <div class="container-fluid"> 

            <form [formGroup]="checkoutFormGroup" (ngSubmit)="onSubmit()">
                <!-- Customer Group Start -->
                <div formGroupName="customer" class="form-area">

                    <h3>Customer</h3>
                    <div class="row">
                            <div class="col-md-2"><label>First Name </label></div> 
                            <div class="col-md-9">
                                <div class="input-space">
                                    <input  formControlName="firstName" type="text" pattern="[a-zA-Z ]*" placeholder="First Name">
                                    <div class="alert alert-danger" *ngIf="firstName?.invalid && (firstName?.dirty || firstName?.touched)">
                                       <div *ngIf="firstName?.errors?.['required'] || firstName?.errors?.['whiteSpacesNotAllowed']">
                                            First Name Required
                                       </div>
                                       <div *ngIf="firstName?.errors?.['pattern']">
                                            First Name must have alphabets only
                                        </div>
                                       <div *ngIf="firstName?.errors?.['minlength']">
                                            First Name must have atleast 3 characters
                                       </div>
                                    </div>
                                </div>
                            </div>
                                <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Last Name </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="lastName" type="text" pattern="[a-zA-Z ]*" placeholder="Last Name or Surname">
                                <div class="alert alert-danger" *ngIf="lastName?.invalid && (lastName?.dirty || lastName?.touched)">
                                    <div *ngIf="lastName?.errors?.['required'] || lastName?.errors?.['whiteSpacesNotAllowed']">
                                        Last Name Required
                                    </div>
                                    
                                    <div *ngIf="lastName?.errors?.['pattern']">
                                        Last Name must have alphabets only
                                    </div>
                                    <div *ngIf="lastName?.errors?.['minlength']">
                                        Last Name must have atleast 3 characters
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Email </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="email" type="text" placeholder="username@somedomain.com">
                                <div class="alert alert-danger" *ngIf="email?.invalid && (email?.dirty || email?.touched)">
                                        <div *ngIf="email?.errors?.['required']">
                                            Email Required
                                        </div>
                                        <div *ngIf="email?.errors?.['pattern']">
                                            Email Pattern Error : someone@domain.com
                                        </div>
                                    
                                </div>
                                
                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-2"><label>Contact # </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="contactNumber" type="text" placeholder="00923001234567">
                                <div class="alert alert-danger" *ngIf="contactNumber?.invalid && (contactNumber?.dirty || contactNumber?.touched)">
                                    <div *ngIf="contactNumber?.errors?.['required'] || contactNumber?.errors?.['whiteSpacesNotAllowed']">
                                        Contact Number Required
                                    </div>
                                    
                                    <div *ngIf="contactNumber?.errors?.['pattern']">
                                        Contact Number Digits only
                                    </div>
                                    <div *ngIf="contactNumber?.errors?.['minlength']">
                                        Contact Number minimum 14 Digits : 00923001234567
                                    </div>
                                    <div *ngIf="contactNumber?.errors?.['maxlength']">
                                        Contact Number maximum  14 Digits : 00923001234567
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                </div>
                <!-- Customer Group End -->
                
                <!-- Shipping Addresss Start -->
                <div formGroupName="shippingAddress" class="form-area"> 
                    <h3>Shipping Address</h3>
                    <div class="row">
                        <div class="col-md-2"><label>Country </label></div> 
                                <div class="col-md-9"><div class="input-space">
                                    
                                    <select formControlName="country" (change)="getStates('shippingAddress')" >
                                        <!-- <option >Countries List</option> -->
                                        <option *ngFor="let country of countriesList" [ngValue]="country">{{country.name}}</option>
                                    </select>

                                    <div class="alert alert-danger" *ngIf="countryShipping?.invalid && (countryShipping?.dirty || countryShipping?.touched)">
                                        <div *ngIf="countryShipping?.errors?.['required'] || countryShipping?.value == 'Countries List'">
                                            Shipping Country Required
                                        </div>
                                        
                                    </div>

                                </div>
                    </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>State </label></div> 
                            <div class="col-md-9"><div class="input-space">
                                <select  formControlName="state">
                                    <!-- <option>States List</option> -->
                                    <option *ngFor="let state of stateListShipping" [ngValue]="state" >{{state.name}}</option>
                                </select>
                                <div class="alert alert-danger" *ngIf="stateShipping?.invalid && (stateShipping?.dirty || stateShipping?.touched)">
                                    <div *ngIf="stateShipping?.errors?.['required']">
                                        Shipping State Required
                                    </div>
                                    
                                </div>
                            </div>
                    </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>city </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="city" type="text" placeholder="City Name">

                                <div class="alert alert-danger" *ngIf="cityShipping?.invalid && (cityShipping?.dirty || cityShipping?.touched)">

                                    <div *ngIf="cityShipping?.errors?.['required'] || cityShipping?.errors?.['whiteSpacesNotAllowed']">
                                         City Name Required
                                    </div>
                                    <div *ngIf="cityShipping?.errors?.['pattern']">
                                         City Name must have alphabets, Numbers and [ , "" @ # & / :] only
                                     </div>
                                    <div *ngIf="cityShipping?.errors?.['minlength']">
                                         City Name must have atleast 3 characters
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>street </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="street" type="text" placeholder="Street Town Village etc">

                                <div class="alert alert-danger" *ngIf="streetShipping?.invalid && (streetShipping?.dirty || streetShipping?.touched)">

                                    <div *ngIf="streetShipping?.errors?.['required'] || streetShipping?.errors?.['whiteSpacesNotAllowed']">
                                         Street, Town, Village etc Name Required
                                    </div>
                                    <div *ngIf="streetShipping?.errors?.['minlength']">
                                        Street Name must have atleast 3 characters
                                   </div>


                                </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>House # </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="houseNumber" type="text" placeholder="House #  or House Identity">

                                <div class="alert alert-danger" *ngIf="houseNumberShipping?.invalid && (houseNumberShipping?.dirty || houseNumberShipping?.touched)">

                                    <div *ngIf="houseNumberShipping?.errors?.['required'] || houseNumberShipping?.errors?.['whiteSpacesNotAllowed']">
                                         House # or House Identity etc Name Required
                                    </div>
                                    <div *ngIf="houseNumberShipping?.errors?.['minlength']">
                                        Street Name must have atleast 1 characters
                                   </div>
                                </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Contact # </label></div> 
                        <div class="col-md-9">
                            <div class="input-space"><input  formControlName="contactNumber" type="text" placeholder="00923001234567">

                                <div class="alert alert-danger" *ngIf="contactNumberShipping?.invalid && (contactNumberShipping?.dirty || contactNumberShipping?.touched)">
                                    
                                    <div *ngIf="contactNumberShipping?.errors?.['required'] || contactNumberShipping?.errors?.['whiteSpacesNotAllowed']">
                                        Contact Number Required
                                    </div>
                                    
                                    <div *ngIf="contactNumberShipping?.errors?.['pattern']">
                                        Contact Number Digits only
                                    </div>
                                    <div *ngIf="contactNumberShipping?.errors?.['minlength']">
                                        Contact Number minimum 14 Digits : 00923001234567
                                    </div>
                                    <div *ngIf="contactNumberShipping?.errors?.['maxlength']">
                                        Contact Number maximum  14 Digits : 00923001234567
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>zipCode </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="zipCode" type="text" placeholder="Zip Code or Postal Code (e.g; ISB Zip  = 44000) : https://www.pakpost.gov.pk/postcodes.php ">

                                <div class="alert alert-danger" *ngIf="zipCodeShipping?.invalid && (zipCodeShipping?.dirty || zipCodeShipping?.touched)">

                                    <div *ngIf="zipCodeShipping?.errors?.['required'] || zipCodeShipping?.errors?.['whiteSpacesNotAllowed']">
                                        Zip Code or Postal Code Required
                                    </div>
                                    <div *ngIf="zipCodeShipping?.errors?.['pattern']">
                                        Zip Code or Postal Code Digits and  Hyphen(-) only
                                    </div>
                                    <div *ngIf="zipCodeShipping?.errors?.['maxlength']">
                                        Zip Code or Postal Code maximum 12 characters long
                                   </div>
                                </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>
                </div>
                <!-- shipping Address End -->

                <!-- Billing and Shipping Address are Same Start -->
                <div class="input-space">
                    <label class="au-checkbox">
                    <input type="checkbox" (change)="addressShippingBillingSame($event)"/>
                        <span class="au-checkmark"></span> Billing and Shipping Addresses are Same
                    
                    </label>
                </div>
                <!-- Billing and Shipping Address are Same End -->

                <!-- Billing Address Start -->
                <div formGroupName="billingingAddress" class="form-area"> 
                    <h3>Billing Address</h3>
                    <div class="row">
                        <div class="col-md-2"><label>Country </label></div> 
                        <div class="col-md-9"><div class="input-space">
                            <select  formControlName="country" (change)="getStates('billingingAddress')">
                                <option>Countries List</option>
                                <option *ngFor="let country of countriesList" [ngValue]="country">{{country.name}}</option>
                            </select>

                            <div class="alert alert-danger" *ngIf="countryBilling?.invalid && (countryBilling?.dirty || countryBilling?.touched)">
                                <div *ngIf="countryBilling?.errors?.['required'] || countryBilling?.value == 'Countries List'">
                                    Shipping Country Required
                                </div>
                                
                            </div>

                        </div></div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>State / Province </label></div> 
                        <div class="col-md-9"><div class="input-space">
                            <select  formControlName="state">
                                <option>States List</option>
                                <option *ngFor="let state of stateListBilling" [ngValue]="state" >{{state.name}}</option>
                            </select>
                            <div class="alert alert-danger" *ngIf="stateBilling?.invalid && (stateBilling?.dirty || stateBilling?.touched)">
                                <div *ngIf="stateBilling?.errors?.['required']">
                                    Shipping State Required
                                </div>
                            </div>
                        </div></div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>city </label></div> 
                        <div class="col-md-9">
                            <div class="input-space"><input  formControlName="city" type="text" placeholder="City Name">

                                <div class="alert alert-danger" *ngIf="cityBilling?.invalid && (cityBilling?.dirty || cityBilling?.touched)">

                                    <div *ngIf="cityBilling?.errors?.['required'] || cityBilling?.errors?.['whiteSpacesNotAllowed']">
                                         City Name Required
                                    </div>
                                    <div *ngIf="cityBilling?.errors?.['pattern']">
                                         City Name must have alphabets, Numbers only
                                     </div>
                                    <div *ngIf="cityBilling?.errors?.['minlength']">
                                         City Name must have atleast 3 characters
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>street </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="street" type="text" placeholder="Street Town Village etc">

                                <div class="alert alert-danger" *ngIf="streetBilling?.invalid && (streetBilling?.dirty || streetBilling?.touched)">

                                    <div *ngIf="streetBilling?.errors?.['required'] || streetBilling?.errors?.['whiteSpacesNotAllowed']">
                                         Street, Town, Village etc Name Required
                                    </div>
                                    <div *ngIf="streetBilling?.errors?.['minlength']">
                                        Street Name must have atleast 3 characters
                                   </div>
                                </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>House # </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="houseNumber" type="text" placeholder="House # or House Identity">

                                <div class="alert alert-danger" *ngIf="houseNumberBilling?.invalid && (houseNumberBilling?.dirty || houseNumberBilling?.touched)">

                                    <div *ngIf="houseNumberBilling?.errors?.['required'] || houseNumberBilling?.errors?.['whiteSpacesNotAllowed']">
                                         House # or House Identity etc Name Required
                                    </div>
                                    <div *ngIf="houseNumberBilling?.errors?.['minlength']">
                                        Street Name must have atleast 1 characters
                                   </div>
                                </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Contact # </label></div> 
                        <div class="col-md-9">
                            <div class="input-space"><input  formControlName="contactNumber" type="text"  placeholder="00923001234567">

                                <div class="alert alert-danger" *ngIf="contactNumberBilling?.invalid && (contactNumberBilling?.dirty || contactNumberBilling?.touched)">
                                    
                                    <div *ngIf="contactNumberBilling?.errors?.['required'] || contactNumberBilling?.errors?.['whiteSpacesNotAllowed']">
                                        Contact Number Required
                                    </div>
                                    
                                    <div *ngIf="contactNumberBilling?.errors?.['pattern']">
                                        Contact Number Digits only
                                    </div>
                                    <div *ngIf="contactNumberBilling?.errors?.['minlength']">
                                        Contact Number minimum 14 Digits : 00923001234567
                                    </div>
                                    <div *ngIf="contactNumberBilling?.errors?.['maxlength']">
                                        Contact Number maximum  14 Digits : 00923001234567
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>zipCode </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="zipCode" type="text" placeholder="Zip Code or Postal Code (e.g; ISB Zip  = 44000) : https://www.pakpost.gov.pk/postcodes.php ">

                                <div class="alert alert-danger" *ngIf="zipCodeBilling?.invalid && (zipCodeBilling?.dirty || zipCodeBilling?.touched)">

                                    <div *ngIf="zipCodeBilling?.errors?.['required'] || zipCodeBilling?.errors?.['whiteSpacesNotAllowed']">
                                        Zip Code or Postal Code Required
                                    </div>
                                    <div *ngIf="zipCodeBilling?.errors?.['pattern']">
                                        Zip Code or Postal Code Digits and Hyphen(-) only
                                    </div>
                                    <div *ngIf="zipCodeBilling?.errors?.['maxlength']">
                                        Zip Code or Postal Code maximum 12 characters long
                                   </div>
                                </div> 


                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>
                </div>
                <!-- Billing Address End -->

                <!-- Card Payment Or Cash On Delivery Start -->
                <div class="input-space">
                    <div class="row">
                        <div class="col-md-4">
                            <label class="form-check-label">
                                <input class="form-check-input" name="showCardPayment" (change)="paymentModeSelect($event)"  type="radio" [checked]="select" />
                                    <span class="form-check-label"></span> Card Payment 
                            </label>
                        </div>
                        <div class="col-md-4">
                            <label class="form-check-label">
                                <input class="form-check-input" name="showCardPayment" (change)="paymentModeSelect($event)" type="radio" [checked]="!select" />
                                    <span class="form-check-label"></span> Cash on Delivery
                            </label>
                        </div>
                        <div class="col-md-4"></div>
                    </div>
                    
                </div>
                <!-- <div class="form-area" *ngIf="select == true"><h3>Cradit Card</h3></div> -->
                
                <!-- Card Payment Or Cash On Delivery End -->
                <div class="form-area" *ngIf="select == false">
                    <h3>Cash On Delivery</h3>
                    <div class="row">
                        <div class="col-md-2"></div> 
                        <div class="col-md-9"><label><b>Payment Method Cash on Delivery</b></label></div>
                        <div class="col-md-1"></div>
                    </div>
                </div>
                  
                <div formGroupName="craditCard" class="form-area"  *ngIf="select == true" >
                    <h3>Cradit Card</h3>
                    <div class="row">
                        <div class="col-md-2"><label>Card Type </label></div> 
                        <div class="col-md-9"><div class="input-space">
                            <select  formControlName="cardType">
                                <!-- <option [defaultSelected]="true">Select Card Type</option> -->
                                <option>Visa Card</option>
                                <option>Master Card</option>
                            </select>

                            <div class="alert alert-danger" *ngIf="cardType?.invalid && (cardType?.dirty || cardType?.touched)">
                                <div *ngIf="cardType?.errors?.['required']">
                                    Card Type Required
                                </div>
                            </div>

                        </div>
                    </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Name On Card </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="nameOnCard" type="text" placeholder="Name On Card">

                                <div class="alert alert-danger" *ngIf="nameOnCard?.invalid && (nameOnCard?.dirty || nameOnCard?.touched)">

                                    <div *ngIf="nameOnCard?.errors?.['required'] || nameOnCard?.errors?.['whiteSpacesNotAllowed']">
                                        Name On Card Required
                                    </div>
                                    <div *ngIf="nameOnCard?.errors?.['pattern']">
                                        Name On Card alphabets only
                                    </div>
                                    <div *ngIf="nameOnCard?.errors?.['minlength']">
                                        Name On Card miniimum 3 characters
                                   </div>
                                </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Card Number </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="cardNumber" type="text" placeholder="16 Digit Card Number">

                                <div class="alert alert-danger" *ngIf="cardNumber?.invalid && (cardNumber?.dirty || cardNumber?.touched)">

                                    <div *ngIf="cardNumber?.errors?.['required'] || cardNumber?.errors?.['whiteSpacesNotAllowed']">
                                        Card Number Required
                                    </div>
                                    <div *ngIf="cardNumber?.errors?.['pattern']">
                                        Card Number 16 Digits only
                                    </div>
                                    <div *ngIf="cardNumber?.errors?.['minlength']">
                                        Card Number minimum 16 Digits
                                   </div>
                                   <div *ngIf="cardNumber?.errors?.['maxlength']">
                                    Card Number maximum 16 Digits
                               </div>
                                </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Security Code </label></div> 
                        <div class="col-md-9">
                            <div class="input-space">
                                <input  formControlName="securityCode" type="text" placeholder="Security Code on Back side of a Card (e.g; 099)">

                                <div class="alert alert-danger" *ngIf="securityCode?.invalid && (securityCode?.dirty || securityCode?.touched)">

                                    <div *ngIf="securityCode?.errors?.['required'] || securityCode?.errors?.['whiteSpacesNotAllowed']">
                                        Security Code Required
                                    </div>
                                    <div *ngIf="securityCode?.errors?.['pattern']">
                                        Security Code 3 Digits only
                                    </div>
                                    <div *ngIf="securityCode?.errors?.['minlength']">
                                        Security Code minimum 3 Digits
                                   </div>
                                   <div *ngIf="securityCode?.errors?.['maxlength']">
                                    Security Code maximum 3 Digits
                               </div>

                            </div> 

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Expiry Year </label></div> 
                        <div class="col-md-9"><div class="input-space">
                            
                            <select  formControlName="expiryYear" (change)="handelMonthsAndYears()">
                                <!-- <option selected="true">Select Year</option> -->
                                <option *ngFor="let year of cardYears">{{year}}</option>
                            </select>

                            <div class="alert alert-danger" *ngIf="expiryYear?.invalid && (expiryYear?.dirty || expiryYear?.touched)">

                                <div *ngIf="expiryYear?.errors?.['required'] || expiryYear?.errors?.['whiteSpacesNotAllowed']">
                                    Card Expiry Year Required
                                </div>

                           </div>
                      

                        </div>
                    </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Expiry Month </label></div> 
                        <div class="col-md-9"><div class="input-space">

                            <select  formControlName="expiryMonth">
                                <!-- <option selected="true">Select Month</option> -->
                                <option *ngFor="let month of cardMonths">{{month}}</option>
                            </select>

                            <div class="alert alert-danger" *ngIf="expiryMonth?.invalid && (expiryMonth?.dirty || expiryMonth?.touched)">

                                <div *ngIf="expiryMonth?.errors?.['required'] || expiryMonth?.errors?.['whiteSpacesNotAllowed']">
                                    Card Expiry Year Required
                                </div>
                                
                           </div>

                        </div>
                    </div>
                        <div class="col-md-1"></div>
                    </div>

                </div>
                <!-- Cradit Card End -->

                <!-- Review Order Start -->
                
                <div formGroupName="reviewOrder" class="form-area">
                    <h3>Review Order</h3>
                    <div class="row">
                        <div class="col-md-2"><label>Total Quantity </label></div> 
                        <div class="col-md-9"><div class="input-space"><input  formControlName="totalQuantity" type="text" placeholder="{{totalQuantity}}" value="{{totalQuantity}}" readonly="true" class="order" ></div></div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Shipping Charges </label></div> 
                        <div class="col-md-9"><div class="input-space"><input formControlName="shippingCharges"  type="text" placeholder="{{shippingCharges}}" value="{{shippingCharges}}" readonly="true" class="order" ></div></div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-2"><label>Total Price </label></div> 
                        <div class="col-md-9"><div class="input-space"><input  formControlName="totalPrice" type="text" placeholder="{{totalPrice | currency: ' Rs '}}" value="{{totalPrice}}" readonly="true" class="order" ></div></div>
                        <div class="col-md-1"></div>
                    </div> 
                </div>

                <!-- Review Order End -->

                <!-- Submit Form -->
                <div class="row" style="margin-top:2% ; margin-bottom: 2%;">
                    <div class="col-md-2"></div>
                    <div class="col-md-9"><div class="input-space"><button style="margin-left: 45%; " type="submit" class="btn btn-primary btn-lg">Purchase</button></div></div>
                    <div class="col-md-1"></div>
                </div>
            </form>

        </div>
    </div>
</div>


*/


///////////HTML ///////////