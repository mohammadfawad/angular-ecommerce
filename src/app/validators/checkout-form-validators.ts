import { FormControl, ValidationErrors } from "@angular/forms";

export class CheckoutFormValidators {
    
    static whiteSpacesNotAllowed(control: FormControl) : ValidationErrors | null{
        if((control.value != null) && (control.value.trim().length === 0) ){
            // In case not Valid
            return {'whiteSpacesNotAllowed' : true};
        }else{
             // In case Valid
            return  null;
        }
    }

}
