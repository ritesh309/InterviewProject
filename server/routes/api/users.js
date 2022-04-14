const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const router = express.Router();
const gravatar = require( 'gravatar' );
const passport = require( 'passport' );
const User = require( '../../models/User' );

const bcrypt = require( 'bcryptjs' );
const keys = require( '../../config/keys' );


// Login Validators
const validateLoginInput = require( '../../validations/login' );
const validateRegisterInput = require( '../../validations/register' );


//@ Get api/users/test
//TEsts USer Route
//@ Access PUBLIC
router.get( '/test', ( req, res ) => {
    res.json( { msg: "Hello USER" } );


} );

//registering the New USer
router.post( '/register', ( req, res ) => {
    try {
        const { errors, isValid } = validateRegisterInput( req.body );
        //Check validation
        if ( !isValid ) {
            return res.status( 400 ).json( errors );
        }
        User.findOne( { email: req.body.email } )
            .then( user => {
                if ( user ) {
                    errors.email = 'Email already exists';
                    res.status( 400 ).json( errors )
                } else {
                    const email = req.body.email;
                    var avatar_PIC = gravatar.url( email, { s: '200', r: 'pg', d: 'mm' } );
                    const newUser = new User( {
                        name: req.body.name,
                        email: req.body.email,
                        username: req.body.username,
                        phoneNumber: req.body.phoneNumber,
                        password: req.body.password,
                        avatar: avatar_PIC
                    } );

                    bcrypt.genSalt( 10, ( err, salt ) => {
                        bcrypt.hash( newUser.password, salt, ( err, hash ) => {
                            if ( err ) return err;
                            newUser.password = hash;
                            newUser.save()
                                .then( user => res.json( user ) )
                                .catch( err => console.log( err ) );
                        } )
                    } )
                }
            } )
            .catch( error => res.status( 500 ).json( errors.email = "User Not Found" ) );

    } catch ( error ) {
        console.log( error );
    }

} );


//Login module

router.post( '/login', ( req, res ) => {

    const { errors, isValid } = validateLoginInput( req.body );
    //Check validation
    if ( !isValid ) {
        return res.status( 400 ).json( errors );
    }
    const { email, password } = req.body

    //Find user by email
    try {
        User.findOne( { email: email } ).then( ( user ) => {
            if ( !user ) {
                errors.email = 'User not found';
                return res.status( 500 ).json( errors )
            }
            if ( user ) {
                bcrypt.compare( password, user.password ).then( ( isMatch ) => {
                    if ( isMatch ) {

                        //USer matched
                        //Create JWT Payload
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }
                        jwt.sign( payload, keys.secretOrKey, { expiresIn: 3600 }, ( err, token ) => {
                            res.json( {
                                success: true,
                                token: 'Bearer ' + token
                            } )
                        } );

                        // return res.status( 200 ).json( { msg: "Success" } )
                    }
                    else {
                        errors.password = 'Invalid Password';
                        res.status( 400 ).json( errors )
                    }
                } ).catch( ( error ) => {
                    console.error( error )
                } )

            }

        } ).catch( ( err ) => { console.error( err ); } )
    } catch ( error ) {
        console.error( error )
    }

} );

//@ Get api/users/current
//Returns current user
//@ Access Private
router.get( '/current', passport.authenticate( "jwt", { session: false } ), ( req, res ) => {
    res.json( {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        phoneNumber: req.user.phoneNumber,
        avatar: req.user.avatar
    } );
} );




module.exports = router;