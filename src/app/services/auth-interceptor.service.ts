import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor( @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable< HttpEvent <any> > {
    return from( this.handelAccess(request, next) );
  }

  private async handelAccess(request: HttpRequest<any>, next: HttpHandler): Promise< HttpEvent <any> > {
   
    // only Add Access Tokens for secured endpoints
    const securedEndpoints = [environment.niqasayApiBaseUrl+'/orderses'];

    if(securedEndpoints.some( url => request.urlWithParams.includes(url))){
      // get access Token
      const tokens = this.oktaAuth.getAccessToken();

      // Clone request and add new header with access token 
      request = request.clone( { setHeaders : { Authorization: 'Bearer ' + tokens}});

    }

    return await lastValueFrom(next.handle(request));
  }
}
 