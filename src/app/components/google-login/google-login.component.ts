
import { OAuthGoogleService, UserInfo } from 'src/app/services/o-auth-google.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {

 // User Data
 token!: string;
 userId!: string;
 userName!: string;
 userImageUrl!: string;
 userEmail !: string;

 loggedIn: boolean = false;

 browserSessionStorage:Storage = sessionStorage;

 auth2: any;
 @ViewChild('loginRef', { static: true }) loginElement!: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef){}

  ngOnInit(): void {
    this.googleAuthSDK();
  }

  callLogin() {

    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleAuthUser: any) => {

        this.loggedIn = true;
       
        //Print profile details in the console logs

        let profile = googleAuthUser.getBasicProfile();

        //User Data Initialization
        const token: string = googleAuthUser.getAuthResponse().id_token;
        const userId: string = profile.getId();
        const userName: string = profile.getName();
        const userImageUrl: string = profile.getImageUrl();
        const userEmail: string = profile.getEmail();
        //alert("this.userName : : " + userName);
        

        // Display User Data
        // document.getElementById("token")!.innerText = this.token;
        // document.getElementById("userId")!.innerText = this.userId;
        
        // document.getElementById("userImageUrl")!.innerText = this.userImageUrl;
        // document.getElementById("userEmail")!.innerText = this.userEmail;

        console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        this.setUserData(token, userId, userName, userImageUrl, userEmail);


      }, (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      });

  }

  googleAuthSDK() {

    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: '56814147831-l1puo7b9peg27u21bk2do03j569ehklr.apps.googleusercontent.com',
          plugin_name:'login',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.callLogin();
      });
    }

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement('script');
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  private async setUserData(token: string, userId: string, userName: string, userImageUrl: string, userEmail: string){
        //User Data Initialization
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.userImageUrl = userImageUrl;
        this.userEmail = userEmail;
        alert("this.userName : : " + this.userName);

        if(this.userName != null){
          // Display User Name Over Status Bar
          document.getElementById("userName")!.innerText = this.userName.toString();
          // Store email in browser storage
          this.browserSessionStorage.setItem('userEmail', this.userEmail as string);
          // Store Name in browser storage
          this.browserSessionStorage.setItem('userName', this.userName  as string);
        }
         
        this.loggedIn = true;
        alert("this.loggedIn : : " + this.loggedIn);

        this.changeDetectorRef.detectChanges(); 
  }
 

}
