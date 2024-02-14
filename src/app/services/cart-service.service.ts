import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root' 
})
export class CartServiceService {

  cartItems:CartItem[] = [];

  //Session Storage is deleted when browser tab is closed 
  //browserStorage: Storage = sessionStorage;
  //If permanent Storage is requried Browser local storage is used
  browserStorage: Storage = localStorage;

  // 1 - Subject is sub-class of Observeable used to publish events to its subscribers and only contains "final status" (do not record previous-events only send new events to subscribers) 
  // 2 - ReplaySubject records/buffer previous "all events" also and deliver it to new subscribers with "final status" (subscriber gets replay of all previous events)
  // 3 - BehaviourSubject will record/buffer only "final sub-events" and deliver it to new Subscribers with "final status" (buffers last/latest events sent preior to subscribing)
  // Finally For Late Subscription we use BehaviorSubject<number>(0);
  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  constructor() { 
    //read data from Browser Storage
    let browserData = JSON.parse(this.browserStorage.getItem('cartItems')!);
    if(browserData != null){
      // Assign Browser cart items
      this.cartItems = browserData;
      this.computeCartTotals();
    }
   }

   // Write cart Items to Browser Storage
   persistCartItemsToBrowserStorage(){
    this.browserStorage.setItem('cartItems' , JSON.stringify(this.cartItems));
   }

// review
  // listCartDetails(){
    
  // }

  addToCart(theCartItem:CartItem){

    let alreadyExsistsInCart: Boolean = false;
    let exsistingCartItem: CartItem | undefined;

    if(this.cartItems.length > 0){
      //Search cart by item id in cart : Check New item already exsists in cart
      //find() returns item or undefined if not found
      exsistingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id );
      //Check if we found it
      alreadyExsistsInCart = (exsistingCartItem != undefined);

      //   //working Accurately
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     exsistingCartItem = tempCartItem;
      //     exsistingCartItem!.quantity ++; or tempCartItem.quantity ++;
      //     alreadyExsistsInCart = true;
      //     break;
      //   }
      // }
    }
    //Check if item found inside cart then Increase Esisting Item Quantity :
    // else if item was not found inside cart : Add New Item In Cart Array
    if(alreadyExsistsInCart){
      exsistingCartItem!.quantity ++;
    }else{
      this.cartItems.push(theCartItem);
    }
    
    this.computeCartTotals();

  }

  decrementCartItemQuantity(theCartItem: CartItem){
    if(theCartItem.quantity > 0){
      theCartItem.quantity --;
    }else if(theCartItem.quantity <= 0){
      this.removeItem(theCartItem);
    }
    this.computeCartTotals();
  }

  removeItem(theCartItem: CartItem){
    // Return Item Index if found else -1 
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id == theCartItem.id);
    // If found remove Item from Given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
    }
  }

  computeCartTotals(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //this.logCartData(totalPriceValue, totalQuantityValue);

    // Write Cart Items to Client Browser Storage
    this.persistCartItemsToBrowserStorage(); 
  }

  logCartData(totalPriceValue:number, totalQuantityValue:number){
    console.log('-----------------------------------------------------------------------------');
    console.log('Contents of Cart : ');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log('Name = ' + tempCartItem.name + ', Quantity = ' + tempCartItem.quantity + ', SubTotal Price = ' +  subTotalPrice.toFixed(2)); 
    }
    console.log('totalPriceValue : ' +  totalPriceValue.toFixed(2) + ', totalQuantityValue : ' + totalQuantityValue );
    console.log('-----------------------------------------------------------------------------');
  }

}
