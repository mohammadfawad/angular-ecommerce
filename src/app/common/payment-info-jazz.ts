import { environment } from "src/environments/environment";

export class PaymentInfoJazz {
    marchantId!:string;
    password!:string;
    integritySalt!:string;
    currency!:string;
    language!:string;
    postMwalletUrl!:string;
    postCardtUrl!:string;

    constructor(){
        this.marchantId = environment.jazzMarchantId;
        this.password = environment.jazzPassword;
        this.integritySalt = environment.jazzIntegritySalt;
        this.currency = environment.jazzCurrencyCode;
        this.language = environment.jazzLanguage;
        this.postCardtUrl = environment.jazzPostCardUrl;
        this.postMwalletUrl = environment.jazzPostMWalletUrl;

    }
}
