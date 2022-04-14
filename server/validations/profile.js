const Validator = require( 'validator' );
const isEmpty = require( './isEmpty' );

module.exports = function validateProfileInput( data ) {
    let errors = {};

    data.handle = !isEmpty( data.handle ) ? data.handle : ''
    data.status = !isEmpty( data.status ) ? data.status : ''
    data.skills = !isEmpty( data.skills ) ? data.skills : ''
    // data.bio = !isEmpty( data.bio ) ? data.bio : ''
    // data.githubusername = !isEmpty( data.githubusername ) ? data.githubusername : ''


    if ( !Validator.isLength( data.handle, { min: 2, max: 40 } ) ) {
        errors.handle = "Handle must be between 2 and 40 characters ⚡"
    }
    if ( Validator.isEmpty( data.handle ) ) {
        errors.handle = "Handle field is required ⚡"
    }

    if ( Validator.isEmpty( data.status ) ) {
        errors.status = "Status field is required ⚡"
    }
    if ( Validator.isEmpty( data.skills ) ) {
        errors.skills = "Skills field is required ⚡"
    }


    if ( !isEmpty( data.linkedin ) ) {
        if ( !Validator.isURL( data.linkedin ) ) {
            errors.linkedin = "Not a valid URL ⚡"
        }
    }
    if ( !isEmpty( data.instagram ) ) {
        if ( !Validator.isURL( data.instagram ) ) {
            errors.instagram = "Not a valid URL ⚡"
        }
    }

    if ( !isEmpty( data.youtube ) ) {
        if ( !Validator.isURL( data.youtube ) ) {
            errors.youtube = "Not a valid URL ⚡"
        }
    }
    if ( !isEmpty( data.githubusername ) ) {
        if ( !Validator.isURL( data.girhubusername ) ) {
            errors.githubusername = "Not a valid URL ⚡"
        }
    }

    if ( !isEmpty( data.company ) ) {
        if ( !Validator.isLength( data.company, { min: 2, max: 40 } ) ) {
            errors.company = "Company name must be between 2 and 40 characters ⚡"
        }
    }
    if ( !isEmpty( data.website ) ) {
        if ( !Validator.isURL( data.website ) ) {
            errors.website = "Not a valid URL ⚡"
        }
    }

    if ( !isEmpty( data.location ) ) {
        if ( !Validator.isLength( data.location, { min: 2, max: 40 } ) ) {
            errors.location = "Location must be between 2 and 40 characters ⚡"
        }
    }


    return {
        errors,
        isValid: isEmpty( errors )
    }
}