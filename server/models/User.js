const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

//Create a USER SCHEMA`
const UserSchema = mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true

    },
    phoneNumber: {
        type: String,
       
    },
    password: {
        type: String,
        required: true
    },
    avatar: {

        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
} )

const User = mongoose.model( 'users', UserSchema );

module.exports = User;