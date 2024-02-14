import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, ReplaySubject, Subject } from 'rxjs';

const oAuthConfiguration: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '56814147831-l1puo7b9peg27u21bk2do03j569ehklr.apps.googleusercontent.com',
  scope: 'openid profile email',
  showDebugInformation: true,
};

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class OAuthGoogleService {

  // gmail = 'https://gmail.googleapis.com'

  // userProfileSubject = new Subject<UserInfo>()

  // constructor(private readonly oAuthService:OAuthService, private readonly httpClient: HttpClient) {
  //   this.oAuthService.configure(oAuthConfiguration);
  //   this.oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";
  //  }

  //  initiateLogin(){

  //   this.oAuthService.loadDiscoveryDocument().then(() => {
  //     this.oAuthService.tryLoginImplicitFlow().then(() => {
  //       if(!this.oAuthService.hasValidAccessToken()){
  //         this.oAuthService.initLoginFlow();
  //       }else{
  //         this.oAuthService.loadUserProfile().then( (userProfile) => { this.userProfileSubject.next(userProfile as UserInfo) });
  //       }
  //     });
  //   });
  //  }

  //  emails(userId: string): Observable<any> {
  //   return this.httpClient.get(`${this.gmail}/gmail/v1/users/${userId}/messages`, { headers: this.authHeader() })
  // }

  // getMail(userId: string, mailId: string): Observable<any> {
  //   return this.httpClient.get(`${this.gmail}/gmail/v1/users/${userId}/messages/${mailId}`, { headers: this.authHeader() })
  // }

  // isLoggedIn(): boolean {
  //   return this.oAuthService.hasValidAccessToken()
  // }

  // signOut() {
  //   this.oAuthService.logOut()
  // }

  // private authHeader() : HttpHeaders {
  //   return new HttpHeaders ({
  //     'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
  //   })
  // }


  private auth2!:gapi.auth2.GoogleAuth;
  private subject: any | null = new ReplaySubject<gapi.auth2.GoogleUser>(1);

  constructor() { 
    gapi.load('auth2', () => {this.auth2 = gapi.auth2.init({
      client_id:'56814147831-l1puo7b9peg27u21bk2do03j569ehklr.apps.googleusercontent.com'
    })}  );
  }


  public signIn(){
    this.auth2.signIn({
      scope: 'openid profile',
    }).then( user => { this.subject.next(user)}).catch(() => { this.subject.next(null)});
  }

  public signOut(){
    this.auth2.signOut().then(() => { this.subject.next(null)});
  }

  public userSate(): Observable<gapi.auth2.GoogleUser>{
    return this.subject.asObservable();
  }
}
