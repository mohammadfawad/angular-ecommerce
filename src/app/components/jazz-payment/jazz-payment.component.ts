import { Component, OnInit } from '@angular/core';
import { PaymentInfoJazz } from 'src/app/common/payment-info-jazz';
import { PaymentJazzMwellet } from 'src/app/common/payment-jazz-mwellet';
import { Buffer } from 'buffer';
//import sha256, { Hash, HMAC } from "fast-sha256";
//import * as shajs from 'sha.js';
//import * as crypto from 'crypto';
// import { AES, SHA256 } from 'crypto-ts';
//import * as createHmac from “create-hmac”;
//import { Crypto } from 'crypto-js';
// import * as Crypto from 'crypto-js';
// import { createHash } from 'crypto';
// import { create } from 'domain';
// import { hmac } from 'fast-sha256';
import { sha256, sha224 } from 'js-sha256';

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
import { JazzDataInterface } from 'src/app/common/jazz-data-interface';
import { UserInformation } from 'src/app/common/user-information';
import { JazzResponse } from 'src/app/common/jazz-response';
import { Subject, BehaviorSubject, async, Observable, of } from 'rxjs';





@Component({
  selector: 'app-jazz-payment',
  templateUrl: './jazz-payment.component.html',
  styleUrls: ['./jazz-payment.component.css']
})
export class JazzPaymentComponent implements OnInit {

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

  //////////////////////////////////////////////

  paymentInfoJazz: PaymentInfoJazz;

  /////////////////////////////////////////////
  jazzMWelletPayement!: PaymentJazzMwellet;
  billReference: string = "JazzMWALLET";
  billDescription: string = "JazzMobileAccountPayment";
  customerMobileNumber: string = '';  // default valid jazz # : "03123456789";
  lastCNICSixDigits: string = ''; // default valid cinic # :'345678'; 
  returnServerUrl = "https://localhost:4200/checkout";
  jazzApiPostCallResponse:string = "";
  jazzResponse: JazzResponse;
  discountAmount: string = '';
  paymentResponseCode: Subject<string> = new BehaviorSubject<string>("");
  ///////////////////////////////////////////

  // Data Required for transaction
  jazzTransactionJSON: string = '';
  jazzDataArray: any;
  jazzConcatedString: string = '';



  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService, private checkoutService: CheckoutService,
    private cartService: CartServiceService, private jazzPaymentService: JazzPaymentService, private router: Router) {
    this.paymentInfoJazz = new PaymentInfoJazz();
    this.jazzResponse = new JazzResponse();

  }

  ngOnInit(): void {

    this.checkoutFormWithValidators();

    //For Shipping in Same Country
    this.countriesPopulate();

    this.reviewcartDetails();

  }

  public createChargeMWellet() {

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

      //Initialize JAZZ Cash Mobile and CNIC Last 6 Digits
      this.customerMobileNumber = this.mobileNumber?.value;
      this.lastCNICSixDigits = this.lastSixCnicDigits?.value;

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




      // CHECK IF FORM IS VALID THEN PROCEED FOR PROCESSING
      if (!this.checkoutFormGroup.invalid) {
       
        // disable Payment Button to avoid more than one clicks 
        this.isDisabled = true;

        // Jazz MWellet Instentiation class
        this.jazzMWelletPayement = new PaymentJazzMwellet(this.totalPrice,
          this.billReference,
          this.billDescription,
          this.customerMobileNumber,
          this.returnServerUrl,
          this.lastCNICSixDigits,
          this.discountAmount);
        //console.log("PaymentJazzMwellet Object : " +  JSON.stringify(this.jazzMWelletPayement) );



        // Jazz Config Array : used for secure Hash Generation
        //let jazzDataInterface:JazzDataInterface;
        let jazzDataMap: Map<string, string> = new Map<string, string>();

        //jazzDataMap.set("pp_Version" , this.jazzMWelletPayement.pp_Version); 
        //jazzDataMap.set("pp_TxnType" , this.jazzMWelletPayement.pp_TxnType);
        jazzDataMap.set("pp_Language", this.jazzMWelletPayement.pp_Language);
        jazzDataMap.set("pp_MerchantID", this.jazzMWelletPayement.pp_MerchantID);
        jazzDataMap.set("pp_SubMerchantID", this.jazzMWelletPayement.pp_SubMerchantID);
        jazzDataMap.set("pp_Password", this.jazzMWelletPayement.pp_Password);
        //jazzDataMap.set("pp_BankID" , this.jazzMWelletPayement.pp_BankID);
        //jazzDataMap.set("pp_ProductID" , this.jazzMWelletPayement.pp_ProductID);
        jazzDataMap.set("pp_TxnRefNo", this.jazzMWelletPayement.pp_TxnRefNo);
        jazzDataMap.set("pp_Amount", this.jazzMWelletPayement.pp_Amount);
        jazzDataMap.set("pp_TxnCurrency", this.jazzMWelletPayement.pp_TxnCurrency);
        jazzDataMap.set("pp_TxnDateTime", this.jazzMWelletPayement.pp_TxnDateTime);
        jazzDataMap.set("pp_BillReference", this.jazzMWelletPayement.pp_BillReference);
        jazzDataMap.set("pp_MobileNumber", this.jazzMWelletPayement.pp_MobileNumber);
        jazzDataMap.set("pp_CNIC", this.jazzMWelletPayement.pp_CNIC);
        jazzDataMap.set("pp_DiscountedAmount", this.jazzMWelletPayement.pp_DiscountedAmount);
        jazzDataMap.set("pp_Description", this.jazzMWelletPayement.pp_Description);
        jazzDataMap.set("pp_TxnExpiryDateTime", this.jazzMWelletPayement.pp_TxnExpiryDateTime);
        //jazzDataMap.set("pp_ReturnURL" , this.jazzMWelletPayement.pp_ReturnURL);
        jazzDataMap.set("pp_SecureHash", this.jazzMWelletPayement.pp_SecureHash);
        jazzDataMap.set("ppmpf_1", this.jazzMWelletPayement.ppmpf_1);
        jazzDataMap.set("ppmpf_2", this.jazzMWelletPayement.ppmpf_2);
        jazzDataMap.set("ppmpf_3", this.jazzMWelletPayement.ppmpf_3);
        jazzDataMap.set("ppmpf_4", this.jazzMWelletPayement.ppmpf_4);
        jazzDataMap.set("ppmpf_5", this.jazzMWelletPayement.ppmpf_5);

        jazzDataMap = new Map([...jazzDataMap.entries()].sort());

        this.jazzDataArray = jazzDataMap;


        alert("Secure Hash Array : " + JSON.stringify(this.jazzDataArray).toString());
        console.log("Secure Hash Array : " + JSON.stringify(this.jazzDataArray));

        // Calculate Hash
        this.getSecureHash();


        // JAZZ POST Data Prepation
        let JazzJSON: string = JSON.stringify(this.jazzMWelletPayement);
        let index: number = JazzJSON.indexOf("},");
        let slicedJSON = "{" + JazzJSON.slice(index + 2);
        JazzJSON = slicedJSON;

        alert(JazzJSON);
        console.log(JSON.parse(JSON.stringify(JazzJSON)));

        // JAZZ POST API CALL
        this.jazzTransactionJSON = JazzJSON;

        const userInfo = new UserInformation();
        userInfo.customerMobileNumber = this.customerMobileNumber;
        userInfo.lastCNICSixDigits = this.lastCNICSixDigits;
        userInfo.totalPrice = (Math.round(this.totalPrice * 100)).toString();
        this.postJazzMWelletApi(userInfo);

        // CHECK RESPONSE CODE AND RESPOND ACCORDINGLY
        
        if((this.jazzPostResponse()) === ""){
          alert("JAZZ RESPONSE EMPTY");
        }else{
          this.checkJazzResponseCode((this.jazzPostResponse()), purchase);
        }
        
      }

    }

  }

  private checkJazzResponseCode(jazzResponseCode:string, purchase:Purchase){

    if (jazzResponseCode === '000') {
      alert("pp_ResponseCode :: " + jazzResponseCode.toString());
      // call REST API using Checkout Service and Place Order, Confirm order Placed Successfully or Error!
      this.checkoutService.placeOrder(purchase).subscribe({
        next: (response: { orderTrackingNumber: string; }) => { alert('Order Placed Successfully \nOrderTrackingNumber :  ' + response.orderTrackingNumber); this.resetCart(); this.isDisabled = true; },
        error: error => { alert("There was an error in Processing Order \nError :  " + error.message); this.isDisabled = true; }

      });

    } else if (jazzResponseCode === '121') {
      alert("pp_ResponseCode :: " + jazzResponseCode);
      // call REST API using Checkout Service and Place Order, Confirm order Placed Successfully or Error!
      this.checkoutService.placeOrder(purchase).subscribe({
        next: (response: { orderTrackingNumber: string; }) => { alert('Order Placed Successfully \nOrderTrackingNumber :  ' + response.orderTrackingNumber); this.resetCart(); this.isDisabled = true; },
        error: error => { alert("There was an error in Processing Order \nError :  " + error.message); this.isDisabled = true; }

      });

    } else if (jazzResponseCode === '11537') {
      this.isDisabled = false;
      alert("Network Communication Error! \n Server Down! \n pp_ResponseCode 11537 checked :: " + jazzResponseCode);
    }else {
      // Enable Payment Button in case of non payment due to some Payment error 
      this.isDisabled = false;
      alert("pp_ResponseCode :: " + jazzResponseCode);
      alert("Transaction Declined! \nError : ");

    }

  }

  private postJazzMWelletApi(userInformation: UserInformation) {
    return this.jazzPaymentService.jazzMWelletPayment(this.paymentInfoJazz.postMwalletUrl, userInformation).subscribe((response) => { this.jazzApiPostCallResponse = response; });
  }

  private jazzPostResponse():string {
    return this.jazzPaymentService.getResponseCode().toString();
  }

  private getSecureHash() {
    /*
    * 1. The SHA-256 HMAC calculation includes all fields.
    * 2. All transaction fields are concatenated in alphabetical order of the ASCII value of each field string 
    * with ‘&’ after every field except the last field. 
    */

    for (let value of this.jazzDataArray.values()) {
      if (value !== '') {
        this.jazzConcatedString += '&' + value;
      }
    }
    //this.jazzConcatedString = this.jazzConcatedString.slice(1);

    /**
     * 3. To this concatenated string, Shared Secret is prepended.
     */
    let clientKeywithAndSalt: string = this.paymentInfoJazz.integritySalt + this.jazzConcatedString;

    console.log("appendedValues ::  " + this.jazzConcatedString);
    console.log("clientKeywithAndSalt ::  " + clientKeywithAndSalt);
    alert("getSecureHash() clientKeywithAndSalt :: " + clientKeywithAndSalt);

    /**
     * 4. This string is first converted into UTF8 bytes and then it is converted into ISO-8859-1 encoding.
     */

    //  clientKeywithAndSalt = Buffer.from(clientKeywithAndSalt, 'utf-8').toString();
    //  console.log("clientKeywithAndSalt utf-8::  " + clientKeywithAndSalt);
    //  alert("getSecureHash() clientKeywithAndSalt utf-8:: " + clientKeywithAndSalt);

    //  clientKeywithAndSalt = encodeURIComponent((clientKeywithAndSalt));
    //  console.log("clientKeywithAndSalt ISO-8859-1::  " + clientKeywithAndSalt);
    //  alert("getSecureHash() clientKeywithAndSalt ISO-8859-1:: " + clientKeywithAndSalt);

    /**
     * 5. The ISO-8859-1 string is then hashed using HMAC with UTF-8 encoded Shared Secret as key.Hmac sha 256 Encryption
     */

    var hash = sha256.hmac.create(this.paymentInfoJazz.integritySalt);
    hash.update(clientKeywithAndSalt);

    /**
     * 6. The generated hash is then converted into hexadecimal.
     */
    hash.hex();

    /**
     * 7. Hash String to upper Case
     */
    this.jazzMWelletPayement.pp_SecureHash = hash.toString().toUpperCase();

    alert("getSecureHash() this.jazzMWelletPayement.pp_SecureHash :: " + this.jazzMWelletPayement.pp_SecureHash.toString());
    console.log("getSecureHash() this.jazzMWelletPayement.pp_SecureHash ::  " + this.jazzMWelletPayement.pp_SecureHash.toString());

    //return this.jazzMWelletPayement.pp_SecureHash;
  }

  parseObjectToJAZZString(obj: any): string {
    //const obj2 = obj;
    let appendAll: any;
    for (var key in obj) {
      //console.log("key: " + key + ", value: " + obj[key] +"&")
      if (obj[key] !== "") {
        appendAll += '&' + obj[key];

        //console.log(  obj[key] + "&" );
        if (obj[key] instanceof Object) {
          this.parseObjectToJAZZString(obj[key]);
        }
      }

    }
    const finalString = appendAll;
    const appendedDataJazzString: string = this.sliceJSONDataFromStart(finalString, 'undefined', '');
    //console.log("parseObjectToJAZZString : : : " + appendedDataJazzString);
    this.jazzConcatedString = appendedDataJazzString;
    return appendedDataJazzString;

  }

  sliceJSONDataFromStart(dataObject: any, searchString: string, replaceString: string): string {
    //let dataJSON: string = JSON.stringify(dataObject);
    let index: number = dataObject.indexOf(searchString);
    let slicedJSON: string = replaceString + dataObject.slice(index + searchString.length);

    slicedJSON = slicedJSON.slice(0, slicedJSON.length - 1);

    //alert("sliceJSONDataFromStart : : : " + slicedJSON);
    //console.log("sliceJSONDataFromStart : : : " + slicedJSON);
    const finalSlicedJSON: string = slicedJSON;
    return finalSlicedJSON;
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
            street: new FormControl('', [Validators.required, Validators.minLength(1), CheckoutFormValidators.whiteSpacesNotAllowed]),
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
            street: new FormControl('', [Validators.required, Validators.minLength(1), CheckoutFormValidators.whiteSpacesNotAllowed]),
            houseNumber: new FormControl('', [Validators.required, Validators.minLength(1), CheckoutFormValidators.whiteSpacesNotAllowed]),
            contactNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(14), Validators.maxLength(14), CheckoutFormValidators.whiteSpacesNotAllowed]),
            zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9-]*'), Validators.maxLength(12), CheckoutFormValidators.whiteSpacesNotAllowed]),
          }
        ),

        jazzMobileAccount: this.formBuilder.group(
          {
            mobileNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{11}'), Validators.minLength(11), Validators.maxLength(11), CheckoutFormValidators.whiteSpacesNotAllowed]),
            lastSixCnicDigits: new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}'), Validators.minLength(6), Validators.maxLength(6), CheckoutFormValidators.whiteSpacesNotAllowed])
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
