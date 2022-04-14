const Validator = require( 'validator' );
const isEmpty = require( './isEmpty' );
const userNameVerification = require( './userNameVerification' );

module.exports = function validateRegisterInput( data ) {
    let errors = {};

    data.name = !isEmpty( data.name ) ? data.name : '';
    data.email = !isEmpty( data.email ) ? data.email : ''
    data.username = !userNameVerification( data.username ) ? data.username : '';
    data.username = !isEmpty( data.username ) ? data.username : '';
    data.password = !isEmpty( data.password ) ? data.password : ''
    data.password2 = !isEmpty( data.password2 ) ? data.password2 : ''



    if ( !Validator.isLength( data.name, { min: 3, max: 30 } ) ) {
        errors.name = "Name must be between 3 and 30 characters ⚡";
    }
    if ( Validator.isEmpty( data.name ) ) {
        errors.name = "Name field is required ⚡"
    }



    if ( !Validator.isEmail( data.email ) ) {
        errors.email = "Email is invalid ⚡"
    }
    if ( Validator.isEmpty( data.email ) ) {
        errors.email = "Email field is required ⚡"
    }
    //Check the length of the USERNAME
    if ( Validator.isEmpty( data.username ) ) {
        if ( !Validator.isLength( data.username, { min: 3, max: 30 } ) ) {
            errors.username = "Username must be between 3 and 30 characters ⚡";
           
        }
    }
    
    // //Checks the Special Character and a number for username
    // if ( Validator.userNameVerification( data.username ) ) {
    //     errors.username = "Username is invalid ⚡"
    // }
    if ( !Validator.isLength( data.password, { min: 6, max: 30 } ) ) {
        errors.password = "Password must be at least 6 characters ⚡"
    }
    if ( Validator.isEmpty( data.password ) ) {
        errors.password = "Password field is required ⚡"
    }


    if ( !Validator.equals( data.password, data.password2 ) ) {
        errors.password2 = "Passwords must match ⚡"
    }

    if ( Validator.isEmpty( data.password2 ) ) {
        errors.password2 = "Password2 field is required ⚡"
    }


    return {
        errors,
        isValid: isEmpty( errors )
    }
}