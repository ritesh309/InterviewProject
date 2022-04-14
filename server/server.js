const express = require( 'express' );
const app = express();
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );
const passport = require( 'passport' );
//Giving PORT
const PORT = process.env.PORT || 5000;



///body parser
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );


const user = require( './routes/api/users' );
const profile = require( './routes/api/profile' );
const posts = require( './routes/api/posts' );

//DB Configs
const db = require( './config/keys' ).mongoURI;

//Connect to mongo db by using monggose

mongoose.connect( db, { useNewUrlParser: true } )
    .then( () => { console.log( 'Connected mongoDB 🚀🚀!' ) } )
    .catch( err => console.log( err ) );


//Passport middleware
app.use( passport.initialize() );

//Passport Configs
require('./config/passport')(passport);


//Routes 
app.use( "/api/users", user );
app.use( "/api/profile", profile );
app.use( "/api/posts", posts );

app.listen( PORT, () => {
    console.log( 'App listening ⭐ port  ' + PORT );
} );