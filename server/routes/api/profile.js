const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const passport = require( 'passport' );

const User = require( '../../models/User' );
const Profile = require( '../../models/Profile' );

//Loat Validations

const validateProfileInput = require( '../../validations/profile' );
const validateExperienceInput = require( '../../validations/experience' );
const validateEducationInput = require( '../../validations/education' );

//@ Get api/profile/test
//TEsts PROFILE Route
//@ Access PUBLIC
router.get( '/test', function ( req, res ) {
    res.json( { msg: "PROFILE" } );
} );


//@ Get api/profile/current
//desc: Get Current user Profile
//@ Access Protected
router.get( '/current', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    const errors = {};
    try {
        Profile.findOne( { user: req.user.id } ).populate( 'user', ['name', 'avatar'] ).then( ( profile ) => {
            if ( !profile ) {
                errors.profile = "No profile found"
                res.status( 404 ).json( errors )
            } else {
                res.json( profile )
            }
        } )
            .catch( ( err ) => {
                res.status( 500 ).json( err );
            } );

    } catch ( error ) {
        res.status( 500 ).json( error );
    }

} );

//@ POST api/profile/
//desc: Create user Profile
//@ Access Protected
router.post( '/', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {

    const { errors, isValid } = validateProfileInput( req.body );

    //Check Validation
    if ( !isValid ) {
        return res.status( 400 ).json( errors )
    }
    //Get Fields
    const profileField = {};
    profileField.user = req.user.id;

    if ( req.body.handle ) profileField.handle = req.body.handle;
    if ( req.body.company ) profileField.company = req.body.company;
    if ( req.body.website ) profileField.website = req.body.website;
    if ( req.body.location ) profileField.location = req.body.location;
    if ( req.body.status ) profileField.status = req.body.status;
    if ( req.body.bio ) profileField.bio = req.body.bio;
    if ( req.body.githubusername ) profileField.githubusername = req.body.githubusername;


    //Skills split into array 
    if ( typeof ( req.body.skills ) !== 'undefined' ) {
        profileField.skills = req.body.skills.split( ',' );


    }

    //Social split
    profileField.social = {};
    if ( req.body.youtube ) profileField.social.youtube = req.body.youtube;
    if ( req.body.twitter ) profileField.social.twitter = req.body.twitter;
    if ( req.body.facebook ) profileField.facebook = req.body.facebook;
    if ( req.body.linkedin ) profileField.linkedin = req.body.linkedin;
    if ( req.body.instagram ) profileField.instagram = req.body.instagram;

    Profile.findOne( { user: req.user.id } ).then( ( profile ) => {
        if ( profile ) {
            //Update
            Profile.findOneAndUpdate( { user: req.user.id }, { $set: profileField }, { new: true } ).then( ( profile ) => {
                res.json( profile );
            } ).catch( ( err ) => {
                res.status( 500 ).json( err );
            } );
        } else {
            //Create
            //Check if handle exists
            Profile.findOne( { handle: profileField.handle } ).then( ( profile ) => {
                if ( profile ) {
                    errors.handle = 'That handle already exists';
                    res.status( 400 ).json( errors );
                }

                //Save Profile
                new Profile( profileField ).save().then( ( profile ) => {
                    res.json( profile );

                } ).catch( ( err ) => {
                    res.status( 500 ).json( err );
                } )
            } ).catch( ( err ) => {
                res.status( 500 ).json( err );
            } );
        }
    } );
} );

//@ POST api/profile/handle:handle
//desc: Get profile by handle
//@ Access Public

router.get( '/all', ( req, res ) => {
    const errors = {};
    Profile.find().populate( 'user', ['name', 'avatar'] ).then( ( profiles ) => {
        if ( !profiles ) {
            errors.noprofiles = "No profiles found"
            res.status( 404 ).json( errors )
        }
        res.json( profiles );
    } ).catch( ( err ) => {
        res.status( 500 ).json( { profiles: "There are no profiles " } );
    } );

} );
//@ POST api/profile/handle:handle
//desc: Get profile by handle
//@ Access Public

router.get( '/handle/:handle', ( req, res ) => {
    const errors = {};
    Profile.findOne( { handle: req.params.handle } ).populate( 'user', ['name', 'avatar'] ).then( ( profile ) => {
        if ( !profile ) {
            errors.noprofile = "No profile found"
            res.status( 404 ).json( errors )
        }
        res.json( profile );
    } ).catch( ( err ) => {
        res.status( 500 ).json( { profile: "There are  no profiles" } );
    } );

} );

//@ GET api/profile/id:id
//desc: Get profile by id
//@ Access Public

router.get( '/user/:user_id', ( req, res ) => {
    const errors = {};
    Profile.findOne( { handle: req.params.user_id } ).populate( 'user', ['name', 'avatar'] ).then( ( profile ) => {
        if ( !profile ) {
            errors.noprofile = "No profile found"
            res.status( 404 ).json( errors )
        }
        res.json( profile );
    } ).catch( ( err ) => {
        res.status( 500 ).json( { profile: "There are no profiles" } );
    } );

} );


//@ POST api/profile/experience
//desc: Add Experience to profile
//@ Access Private

router.post( '/experience', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    const { errors, isValid } = validateExperienceInput( req.body );

    if ( !isValid ) {
        return res.status( 400 ).send( errors );
    }

    Profile.findOne( { user: req.user.id } )
        .then( profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //Add to Experience array
            profile.experience.unshift( newExp );
            profile.save().then( ( profile ) => {
                res.json( profile );
            } ).catch( err => {
                res.status( 500 ).json( err );
            } )
        } ).catch( err => { } );
} )
//@ POST api/profile/education
//desc: Add Education to profile
//@ Access Private

router.post( '/education', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    const { errors, isValid } = validateEducationInput( req.body );

    if ( !isValid ) {
        return res.status( 400 ).send( errors );
    }

    Profile.findOne( { user: req.user.id } )
        .then( profile => {
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description

            }

            //Add to Education array
            profile.education.unshift( newEducation );
            profile.save().then( ( profile ) => {
                res.json( profile );
            } ).catch( err => {
                res.status( 500 ).json( err );
            } )
        } ).catch( err => { } );
} )

//@ DELETE api/profile/experience/:exp_id
//desc: Delete Experience from profile
//@ Access Private

router.delete( '/experience/:exp_id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {

    Profile.findOne( { user: req.user.id } )
        .then( profile => {
            //   get remove index

            const removeIndex = profile.experience
                .map( item => item.id ).indexOf( req.params.exp_id );
            //Splice out of array
            profile.experience.splice( removeIndex, 1 );

            //Save Profile
            profile.save().then( ( profile ) => {
                res.json( profile );
            } ).catch( err => {
                res.status( 404 ).json( err );
            } );
        } ).catch( err => {
            res.status( 404 ).json( err );
        } );
} )

//@ DELETE api/profile/education/:edu_id
//desc: Delete Education from profile
//@ Access Private

router.delete( '/education/:edu_id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    Profile.findOne( { user: req.user.id } )
        .then( profile => {
            //   get remove index
            const removeIndex = profile.exucation
                .map( item => item.id ).indexOf( req.params.edu_id );
            //Splice out of array
            profile.education.splice( removeIndex, 1 );

            //Save Profile
            profile.save().then( ( profile ) => {
                res.json( profile );
            } ).catch( err => {
                res.status( 404 ).json( err );
            } );
        } ).catch( err => {
            res.status( 404 ).json( err );
        } );
} );

//@ DELETE api/profile
//desc: Delete Education from profile
//@ Access Private

router.delete( '/', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    Profile.findOneAndRemove( { user: req.user.id } )
        .then( () => {
            User.findByIdAndRemove( { _id: req.user.id } ).then( () => {
                res.json( { success: true } )
            } )
                .catch( ( error ) => {
                    res.status( 500 ).json( error );
                } )
        } ).catch( err => { } );

} );




module.exports = router;