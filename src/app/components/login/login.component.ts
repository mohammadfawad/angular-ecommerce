import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import applicationConfig from 'src/app/config/application-config';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn:any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    //okta-signin-widget.d.ts + pkce : Proof key for code Exchange
    this.oktaSignIn = new OktaSignIn({ 
      
      logo: '../../../assets/images/logoNiqasay2.png',
      //features:{registeration: true,  useInteractionCodeFlow: true},
      //useInteractionCodeFlow: true,
      baseUrl: applicationConfig.oidc.issuer.split('/oauth2')[0],
      clientId: applicationConfig.oidc.clientId,
      redirectUri: applicationConfig.oidc.redirectUri,
      //issuer: applicationConfig.oidc.issuer,
      //useClassicEngine: true,

      authParams:{
        //pkce:true,
        issuer: applicationConfig.oidc.issuer,
        scopes: applicationConfig.oidc.scopes
      }
      

      /*baseUrl: applicationConfig.oidc.issuer.split('/oauth2')[0],
      clientId: applicationConfig.oidc.clientId,
      redirectUri: applicationConfig.oidc.redirectUri,
      logo: 'assets/images/butterflylogo.png',
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to Angular & Company',
        },
      },
      authClient: oktaAuth as any,
      useInteractionCodeFlow: true,

    }*/
  });

   }

  ngOnInit(): void {

    this.oktaSignIn.remove();

    this.oktaSignIn.renderEl(
      //div id : Okta-sign-in-widget

      { el : '#Okta-sign-in-widget' },
      (response: any) => {  if(response.status === 'SUCCESS'){ this.oktaAuth.signInWithRedirect(); } },
      (error: any) => { throw error; }

    );

  }

}
