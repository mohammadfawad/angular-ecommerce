import { Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductService } from './services/product.service';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductNavbarMenuComponent } from './components/product-navbar-menu/product-navbar-menu.component';
import { SearchComponent } from './components/search/search.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OktaAuthGuard, OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import applicationConfig from 'src/app/config/application-config';
import { CourselComponent } from './components/coursel/coursel.component';
import { FooterComponent } from './components/footer/footer.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProductTiledViewComponent } from './components/product-tiled-view/product-tiled-view.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { JazzPaymentComponent } from './components/jazz-payment/jazz-payment.component';
import { CashOnDeliveryComponent } from './components/cash-on-delivery/cash-on-delivery.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { CopyrightsComponent } from './components/copyrights/copyrights.component';
import { StorelocationComponent } from './components/storelocation/storelocation.component';
import { CareersComponent } from './components/careers/careers.component';
import { CompanyinfoComponent } from './components/companyinfo/companyinfo.component';
import { ReturnpolicyComponent } from './components/returnpolicy/returnpolicy.component';
import { PrivacypolicyComponent } from './components/privacypolicy/privacypolicy.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { OrderconfermationComponent } from './components/orderconfermation/orderconfermation.component';
import { OrderstatusComponent } from './components/orderstatus/orderstatus.component';
import { FrequentlyaskedComponent } from './components/frequentlyasked/frequentlyasked.component';

const oktaConfig = applicationConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth:OktaAuth, injector:Injector) {
  const router = injector.get(Router);
  router.navigate(['/login']);
}

const routes: Routes = [
  {path : 'frequentlyasked', component: FrequentlyaskedComponent},
  {path : 'orderstatus', component: OrderstatusComponent},
  {path : 'orderconfirmation', component: OrderconfermationComponent},
  {path : 'contactus', component: ContactusComponent},
  {path : 'privacypolicy', component: PrivacypolicyComponent},
  {path : 'returnexchangepolicy', component: ReturnpolicyComponent},
  {path : 'companyinfo', component: CompanyinfoComponent},
  {path : 'career', component: CareersComponent},
  {path : 'storelocation', component: StorelocationComponent},
  {path : 'copyrights', component: CopyrightsComponent},
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired: sendToLoginPage}},
  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired: sendToLoginPage}},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'loginGoogle', component: GoogleLoginComponent},
  {path: 'checkout', component:CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path:'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch:'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    ProductNavbarMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    CourselComponent,
    FooterComponent,
    MembersPageComponent,
    PageNotFoundComponent,
    ProductTiledViewComponent,
    OrderHistoryComponent,
    StripePaymentComponent,
    JazzPaymentComponent,
    CashOnDeliveryComponent,
    GoogleLoginComponent,
    CopyrightsComponent,
    StorelocationComponent,
    CareersComponent,
    CompanyinfoComponent,
    ReturnpolicyComponent,
    PrivacypolicyComponent,
    ContactusComponent,
    OrderconfermationComponent,
    OrderstatusComponent,
    FrequentlyaskedComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    OktaAuthModule,
    SocialLoginModule,
    OAuthModule.forRoot()

  ],
  providers: [ProductService, { provide: OKTA_CONFIG, useValue: {oktaAuth} }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
