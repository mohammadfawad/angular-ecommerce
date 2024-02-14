import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfoStripe } from '../common/payment-info-stripe';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {


  private purchasePostUrl: string = environment.niqasayApiBaseUrl+'/checkout/purchase';
  private paymentIntentUrl: string = environment.niqasayApiBaseUrl+'/checkout//paymentstripe-intent';

  constructor(private httpClient:HttpClient) { }

  placeOrder(purchase:Purchase): Observable<any>{
    return this.httpClient.post(this.purchasePostUrl, purchase);
  }

  createPaymentIntentStripe(paymentInfoStripe: PaymentInfoStripe): Observable<any> {
   return this.httpClient.post(this.paymentIntentUrl, PaymentInfoStripe);
  }


}
 