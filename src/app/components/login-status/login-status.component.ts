import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  userFullName:string = ''
  isAuthenticated:boolean = false;
  browserSessionStorage:Storage = sessionStorage;

  constructor(private oktaAuthStateService:OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth:OktaAuth) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthStateService.authState$.subscribe(
      (result) => { this.isAuthenticated = result.isAuthenticated!; this.getUserDetails(); }
    );

  }
  getUserDetails() {
    if(this.isAuthenticated){
      this.oktaAuth.getUser().then((res) => { 
        // Get User Full Name as string
        this.userFullName = res.name as string; 
        // Get User email from authenticated response
        const userEmail = res.email as string;  
        // Store email in browser storage
        this.browserSessionStorage.setItem('userEmail', JSON.stringify(userEmail));
        // Store Name in browser storage
        this.browserSessionStorage.setItem('userName', JSON.stringify(this.userFullName));

      });
    }
  }

  logoutUser(){
    //Terminates session with okta and removes current Tokens
    this.oktaAuth.signOut();
  }

}
