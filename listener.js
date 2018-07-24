let express = require( "express" );
let path = require( "path" );
let bodyParser = require( "body-parser" );
let request = require( "request" );
let fs = require( "fs" );

let popular = require( "./json/popular.json" );
let azlist = require( "./json/azlist.json" );
let actress = require( "./json/actress.json" );
let groupPhotos = require( "./json/groupPhotos.json" );
let firebase = require( "firebase" );
let admin = require( "firebase-admin" );

let axios = require( "axios" );

const userIds = [ "rBDrx28dKKMTjhvE1HxY8cwmS1X2" ];
// const userIds = [ "fJdXV54EVWPFefRDBxJGyz0Wmdn2", "Imy8Ro6GEKOLgxdCIVmlWHvnkkr1", "mimQO46d7vPy2W0rqfGzJpMByy82", "O4p202hPZlco6X4Kwg0hUNXC8cI2", "rBDrx28dKKMTjhvE1HxY8cwmS1X2", "VltWiHP4jZagkVrCHx89qWlYYD43" ];


let serviceAccount = require( "./serviceAccountKey.json" );

admin.initializeApp( {
    "credential": admin.credential.cert( serviceAccount ),
    "databaseURL": "https://hott-4cfa4.firebaseio.com"
} );


let config = {
    "apiKey": "AIzaSyBxWkfzvphXjEg6qPFPlWdPb-5glfnoy1g",
    "authDomain": "hott-4cfa4.firebaseapp.com",
    "databaseURL": "https://hott-4cfa4.firebaseio.com",
    "projectId": "hott-4cfa4",
    "storageBucket": "",
    "messagingSenderId": "905775724347"
};

firebase.initializeApp( config );

let app = express();
// view engine setup

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { "extended": false } ) );
app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( ( req, res, next ) => {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
    next();
} );


function notify( data ) {
    console.log( "data is ", data );
    const { userId, message, title } = data;

    console.log( "userId is ", userId );

    const deviceToken = firebase.database().ref( `/users/${userId}/deviceToken` ).once( "value" );

    deviceToken.then( ( result ) => {

        const token_id = result.val();

        console.log( "device token_id is ", token_id );

        const payload = {
            "data": {
                "title": title,
                "message": message
            }
        };

        console.log( "notification payload is: ", payload );

        return admin.messaging().sendToDevice( token_id, payload ).then( ( response ) => {

            console.log( "notification sent to user ", data.userId );

        } );
    } );
}


function acceptFriend( id ) {
    const query = firebase.database().ref( "/Friend_req" ).child( id );

    query.on( "child_added", ( snapshot ) => {
        const user_id = snapshot.key;
        let obj = {};
        const currentDate = new Date();

        obj [ `Friend/${ id }/${ user_id }/date` ] = currentDate;
        obj [ `Friend/${ user_id }/${ id }/date` ] = currentDate;
        obj [ `Friend_req/${ id }/${ user_id}` ] = null;
        obj [ `Friend_req/${ user_id }/${ id}` ] = null;

        firebase.database().ref().update( obj );

        notify( { "userId": user_id, "message": "You have some updates", "title": "Someone has visited your profile. Check it out." } );
    } );
}


// send hi to all the friends of the id
function initiateChat( id ) {
    const query = firebase.database().ref( "/Friend" ).child( id );

    query.on( "child_added", ( snapshot ) => {
        const user_id = snapshot.key;
        let obj = {};
        const currentDate = Date.now();
        const data = {
            "from": id,
            "message": "Gud morning Ji",
            "seen": false,
            "time": currentDate,
            "type": "text"
        };

        obj [ `messages/${ id }/${ user_id }/${currentDate}` ] = data;
        obj [ `messages/${ user_id }/${ id }/${currentDate}` ] = data;

        const chatDataSeen = {
            "seen": true,
            "timestamp": currentDate
        };

        const chatDataUnSeen = {
            "seen": false,
            "timestamp": currentDate
        };

        obj[ `Chat/${ id }/${ user_id}` ] = chatDataSeen;
        obj[ `Chat/${ user_id }/${ id}` ] = chatDataUnSeen;


        firebase.database().ref().update( obj );

        notify( { "userId": user_id, "message": "New message", "title": "You have new message(s). Check it out." } );
    } );
}

function addListener( id ) {
    const query = firebase.database().ref( "/messages" ).child( id ).limitToLast( 1 );

    query.on( "child_added", ( snapshot ) => {
        console.log( `child_added key ${ snapshot.key}` );
        console.log( `child_add val ${ JSON.stringify( snapshot.val() )}` );
    } );

    query.on( "child_changed", ( snapshot ) => {
        console.log( `child_added key ${ snapshot.key}` );
        console.log( `child_add val ${ JSON.stringify( snapshot.val() )}` );
    } );
}

for( let i = 0; i < userIds.length; i++ ) {
    // acceptFriend(userIds[ i ]);
    initiateChat( userIds[ i ] );
    // addListener( userIds[ i ] );
}

let port = process.env.PORT || 3002;

app.listen( port );
console.log( `Sample app is listening on port ${ port}` );
