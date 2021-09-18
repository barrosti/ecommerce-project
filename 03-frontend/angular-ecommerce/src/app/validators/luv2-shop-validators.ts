import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    // whitespace validation
    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors | null {

        // check if string only contains whitespace
        if( (control.value != null) && (control.value.trim() === '' ) ){

            //invalid, return error object
            return { 'notOnlyWhiteSpace' : true };
        }
        
        // valid
        return null;
                
    }

}
