// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //Custom APPLICATION CONFIGURATIONS : API BASE URL
  niqasayApiBaseUrl: "https://localhost:11547/api",

  // STRIPE PUBLISHABLE KEY : its Dummy key (https://stripe.com/docs/testing)
  stripePublishableKey:"sk_test_4eC39HqLyjWDarjtT1zdp7dc",

  // Jazz Configurations
  jazzMarchantId: 'MC48880',
  jazzPassword: '1g1y85xfc4',
  jazzIntegritySalt: 'gz1xv80u0f',
  jazzCurrencyCode: 'PKR',
  jazzLanguage: 'EN',
  jazzPostMWalletUrl: 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction',
  jazzPostCardUrl: 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Purchase/PAY',
  jazzReturnUrl: 'https://localhost:4200/products'
};
 
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
