const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );
const passport = require( 'passport' );

const Profile = require( "../../models/Profile" );
const Post = require( '../../models/Post' );
const validatePostInput = require( '../../validations/post' );

//@ Get api/posts/post
//TEsts POST Route
//@ Access Private

router.post( '/post', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    const { errors, isValid } = validatePostInput( req.body );

    if ( !isValid ) {
        return res.status( 400 ).json( errors );
    }

    const newPost = new Post( {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    } );

    newPost.save().then( ( posts ) => {
        res.json( posts );
    } ).catch( ( err ) => {
        res.status( 400 ).send( err );
    } );

} );

//@ Get api/posts/post
//Access all the posts
//@ Access PUBLIC
router.get( '/post', ( req, res ) => {
    Post.find().sort( { date: -1 } )
        .then( posts => res.json( posts ) )
        .catch( ( err ) => {
            res.status( 400 ).send( err );
        } )
} );

//@ Get api/posts/:id
//Access apost by id
//@ Accesspublic

router.get( '/:id', ( req, res ) => {
    Post.findById( req.params.id )
        .then( posts => res.json( posts ) )
        .catch( ( err ) => {
            errors.nopostfound = "No post found for this id";
            res.status( 400 ).json( nopostfound );
        } )
} );


//@ Delete api/posts/post
//Delete the post 
//@ Access PUBLIC

router.delete( '/:id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    Profile.findOne( { user: req.user.id } ).then( profile => {
        //Check the Post owner
        if ( profile.user ) {
            Post.findById( req.params.id ).then(
                post => {
                    //Check if the post exists
                    if ( post ) {
                        //Check if the post owner is the same as the logged in user 
                        if ( post.user.toString() !== req.user.id ) {
                            res.status( 401 ).json( { notauthorized: 'User not authorized' } );
                        }
                        //Delete
                        post.remove()
                            .then( () => res.json( { success: true } ) )
                            .catch( err => res.status( 404 ).json( { success: false } ) );
                    } else {
                        return res.status( 404 ).json( { postnotfound: 'No post found' } )
                    }
                }
            ).catch( err => res.status( 404 ).json( { postnotfound: 'No post found' } ) );
        } else { }
    } ).catch( err => res.status( 404 ).json( { postnotfound: 'No post found' } ) );
} );

//@ POST api/posts/like/:id
//DHandle the likse
//@ Access Protected

router.post( '/like/:id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    Profile.findOne( { user: req.user.id } ).then( profile => {
        //Check the Post owner
        if ( profile.user ) {
            Post.findById( req.params.id ).then(
                post => {
                    if ( post.likes.filter( like => like.user.toString() === req.user.id ).length > 0 ) {
                        return res.status( 400 ).json( { error: "already liked this post" } )
                    }
                    //Add user id to likes array
                    post.likes.unshift( { user: req.user.id } );

                    post.save().then( post => res.json( post ) ).catch( err => res.status( 400 ).json( err ) );
                }
            ).catch( err => res.status( 404 ).json( { postnotfound: 'No post found' } ) );
        }
    } ).catch( err => res.status( 404 ).json( { postnotfound: 'No post found' } ) );
} );


//@ POST api/posts/unlike/:id
//DHandle the unlikes
//@ Access Protected

router.post( '/unlike/:id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    Profile.findOne( { user: req.user.id } ).then( profile => {
        //Check the Post owner
        if ( profile.user ) {
            Post.findById( req.params.id ).then(
                post => {
                    if ( post.likes.filter( like => like.user.toString() === req.user.id ).length === 0 ) {
                        return res.status( 400 ).json( { error: "Not Liked the post Yet" } )
                    }
                    //Get remove index 
                    const removeIndex = post.likes.map( item => item.user.toString() ).indexOf( req.user.id );

                    //Splice out of array
                    post.likes.splice( removeIndex, 1 );

                    //Save
                    post.save().then( post => {
                        res.satus( 200 ).json( post )
                    } ).catch( err => {
                        res.status( 400 ).json( { error: "Can not save the post" } )
                    } )
                }
            ).catch( err => res.status( 404 ).json( { postnotfound: 'No post found' } ) );
        }
    } ).catch( err => res.status( 404 ).json( { postnotfound: 'No post found' } ) );
} );


//@ POST api/posts/comment/:id
//add comment to post
//@ Access Protected

router.post( '/comment/:id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {
    const { errors, isValid } = validatePostInput( req.body );

    if ( !isValid ) {
        return res.status( 400 ).json( errors );
    }

    Post.findById( req.params.id )
        .then(
            post => {

                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.body.id
                }

                //Add to comment array
                post.comments.unshift( newComment );

                //save the comment
                post.save()
                    .then( post => res.status( 200 ).json( post ) )
                    .catch( err => res.status( 404 ).json( { error: "No POST found" } ) );

            }
        ).catch( err => res.status( 404 ).json( { postnotfound: 'Comment post not found' } ) )
} );

//@ POST api/posts/comment/:id
//REmove comment from post
//@ Access Protected

router.delete( '/comment/:id/:comment_id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) => {

    Post.findById( req.params.id )
        .then(
            post => {

                //Check to see comment exist or not exist
                if ( post.comments.filter( comment => comment._id.toString() === req.params.comment_id ).length === 0 ) {
                    return res.status( 404 ).json( { commentnotexists: "Comment does not exist" } )
                }
                //Get the remove Index
                const removeIndex = post.comments.map( item => item._id.toString() ).indexOf( req.params.comment_id );

                //Splice comment out of array
                post.comments.splice( removeIndex, 1 );


                //save the comment
                post.save()
                    .then( post => res.status( 200 ).json( post ) )
                    .catch( err => res.status( 404 ).json( { error: "Error in saving database" } ) );

            }
        ).catch( err => res.status( 404 ).json( { postnotfound: 'Comment post not found' } ) )
} );


module.exports = router;