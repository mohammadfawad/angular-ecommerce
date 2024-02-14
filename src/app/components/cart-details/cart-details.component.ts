import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){
    // Get Handel to cart Items
    this.cartItems = this.cartService.cartItems;

    // Subscribe to cart total Price
    this.cartService.totalPrice.subscribe((data)=> { this.totalPrice = data});

    // Subscribe to cart total Quantity
    this.cartService.totalQuantity.subscribe((data) => {this.totalQuantity = data});

    // Compute cart total price and total Quantity
    this.cartService.computeCartTotals();

  }

  dcrementItemQuantity(cartItem: CartItem) {
   
    this.cartService.decrementCartItemQuantity(cartItem);
    
  }

  incrementItemQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  deleteItem(cartItem: CartItem){
    this.cartService.removeItem(cartItem);
    this.cartService.computeCartTotals();
  }

}
