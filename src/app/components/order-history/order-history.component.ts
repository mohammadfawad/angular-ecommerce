import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  browserSessionStorage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handelOrderHistory();
  }

  handelOrderHistory(){
    //read user Email from browser Storage
    const userEmail = JSON.stringify( this.browserSessionStorage.getItem('userEmail') );

    //retrive user Data from the Service
    this.orderHistoryService.getOrderHistory(userEmail).subscribe( userData => { this.orderHistoryList = userData._embedded.orderses});

  }

}
