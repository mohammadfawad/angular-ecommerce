import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInformation } from '../common/user-information';

@Injectable({
  providedIn: 'root'
})
export class JazzPaymentService {

  private purchaseJazzPostUrl: string = environment.niqasayApiBaseUrl+'/checkout/jazzpayment';

  private jazzResponseCode:any;
  
  constructor(private httpClient:HttpClient) { }

  public jazzMWelletPayment(jazzMWelletPostUrl:string, userInformation:UserInformation): Observable<any>{ 
    let responseObserveable = this.httpClient.post(this.purchaseJazzPostUrl, userInformation);
    responseObserveable.subscribe((response)=>this.jazzResponseCode = response);
    return responseObserveable; 
    //return this.httpClient.post(jazzMWelletPostUrl, jsonJazzMWelletPostObject);
  }

  public getResponseCode(){
    return this.getResponseCode;
  }
}
