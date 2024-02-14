import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl:string = environment.niqasayApiBaseUrl+'/orderses/search/findByCustomerEmailOrderByDateCreatedDesc?email=';

  constructor(private httpClient:HttpClient) { }

  getOrderHistory(theUserEmail:string):Observable<GetResponseOrderHistory>{
    // UNSORTED : https://localhost:11547/api/orderses/search/findByCustomerEmail?email=m.mohammadJawad@gmail.com
    // SORTED by Order Date : https://localhost:11547/api/orderses/search/findByCustomerEmailOrderByDateCreatedDesc?email=m.mohammadJawad@gmail.com
    //theUserEmail.trim().substring(3, theUserEmail.length-3)
    const orderHistoryUrl:string = this.orderUrl.concat(theUserEmail.trim().substring(3, theUserEmail.length-3));
    console.log('OrderHistoryUrl : ' +  orderHistoryUrl);
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetResponseOrderHistory{
  _embedded: {
      orderses : [];
      }
}
 