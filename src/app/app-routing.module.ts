import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';

import { OktaAuthGuard, OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import applicationConfig from 'src/app/config/application-config';
import { LoginComponent } from './components/login/login.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
