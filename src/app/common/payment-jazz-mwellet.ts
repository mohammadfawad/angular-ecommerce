import { PaymentInfoJazz } from "./payment-info-jazz";

export class PaymentJazzMwellet {

    paymentInfoJazz: PaymentInfoJazz;

    // yyyyMMddHHmmss
    private DateTime!: Date;

    // Request Body Variables : MWellet
    // pp_Version : string;
    // pp_TxnType : string;
    //pp_ProductID:string;
    pp_Language: string;
    pp_MerchantID: string;
    pp_SubMerchantID: string;
    pp_Password: string;
    pp_TxnRefNo: string;
    pp_MobileNumber: string;
    pp_CNIC: string;
    pp_Amount: string;
    pp_DiscountedAmount: string;
    pp_TxnCurrency: string;
    pp_TxnDateTime: string;
    pp_BillReference: string;
    pp_Description: string;
    pp_TxnExpiryDateTime: string;
    pp_SecureHash: string;
    ppmpf_1: string;
    ppmpf_2: string;
    ppmpf_3: string;
    ppmpf_4: string;
    ppmpf_5: string;

    constructor(totalPrice:number, billReference:string, billDescription:string, customerMobileNumber:string, returnlocalhostUrl:string, lastCNICSixDigits:string, discountAmount:string) {
        this.DateTime = new Date();
        this.paymentInfoJazz = new PaymentInfoJazz();
        
        // this.pp_Version = "1.1";
        // this.pp_TxnType = "MWALLET";
        this.pp_MobileNumber = customerMobileNumber;
        this.pp_CNIC = lastCNICSixDigits;
        this.pp_DiscountedAmount = discountAmount;
        //this.pp_BankID = "";
        //this.pp_ProductID = "";
        

        this.pp_Language = this.paymentInfoJazz.language;
        this.pp_MerchantID = this.paymentInfoJazz.marchantId;
        this.pp_SubMerchantID = "";
        this.pp_Password = this.paymentInfoJazz.password;
        this.pp_Amount = (Math.round(totalPrice * 100)).toString() ;// TO remove decimals point OR 1 Rupee = 100 Passa; ONLY Count two digits after decimal point 
        this.pp_TxnCurrency = this.paymentInfoJazz.currency;

        this.pp_TxnDateTime = this.DateTime.getFullYear().toString() 
                            + this.pad2( this.DateTime.getMonth() + 1) 
                            + this.pad2( this.DateTime.getDate()) 
                            + this.pad2( this.DateTime.getHours() ) 
                            + this.pad2( this.DateTime.getMinutes() ) 
                            + this.pad2( this.DateTime.getSeconds() );
        alert("pp_TxnDateTime :  yyyyMMddHHmmss : " + this.pp_TxnDateTime);

        this.pp_TxnRefNo = "T".concat(this.pp_TxnDateTime.toString());
        this.pp_BillReference = billReference;
        this.pp_Description = billDescription;

        this.pp_TxnExpiryDateTime = this.DateTime.getFullYear().toString() 
                                  + this.pad2(this.DateTime.getMonth() + 1) 
                                  + this.pad2( this.DateTime.getDate()) 
                                  + this.pad2( this.DateTime.getHours() + 1 ) 
                                  + this.pad2( this.DateTime.getMinutes() ) 
                                  + this.pad2( this.DateTime.getSeconds() );
        alert("pp_TxnExpiryDateTime :  yyyyMMddHHmmss : " + this.pp_TxnExpiryDateTime);

        //this.pp_ReturnURL = returnlocalhostUrl;
        this.pp_SecureHash = "";
        this.ppmpf_1 = "";//customerMobileNumber
        this.ppmpf_2 = "";
        this.ppmpf_3 = "";
        this.ppmpf_4 = "";
        this.ppmpf_5 = "";
        
    }

    // Appends 0 with values less than 10
    private pad2(n:any) { 

        return n < 10 ? '0' + n : n 
    }

    private TestDates(){
        var date = new Date();

        // Output : "20221014102324" 
        console.log( date.getFullYear().toString() 
                    + this.pad2(date.getMonth() + 1) 
                    + this.pad2( date.getDate()) 
                    + this.pad2( date.getHours() ) 
                    + this.pad2( date.getMinutes() ) 
                    + this.pad2( date.getSeconds() ) );

        // Output : "2022 10 14 10 23 24"
        console.log( `${date.getFullYear().toString()} 
                      ${this.pad2(date.getMonth() + 1)} 
                      ${this.pad2( date.getDate())} 
                      ${this.pad2( date.getHours() )} 
                      ${this.pad2( date.getMinutes() )} 
                      ${this.pad2( date.getSeconds() )}` );

        // Output : "20221014102932"
        let txn = date.getFullYear().toString() + this.pad2(date.getMonth() + 1) + this.pad2( date.getDate()) + this.pad2( date.getHours() ) + this.pad2( date.getMinutes() ) + this.pad2( date.getSeconds() );
        console.log(txn);
        
        // Output : "20221014112932"
        let txn2 = date.getFullYear().toString() + this.pad2(date.getMonth() + 1) + this.pad2( date.getDate()) + this.pad2( date.getHours() + 1) + this.pad2( date.getMinutes() ) + this.pad2( date.getSeconds() );
        console.log(txn2);

    }
}
