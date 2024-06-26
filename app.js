const express=require( 'express' )
const mongoose=require( 'mongoose' )

const indexRoute=require( './Router/index' )
const session=require( 'express-session' );
const MongoStore=require( 'connect-mongo' );
const fs=require( 'fs' );
const crypto=require( 'crypto' );
const cors=require( 'cors' );


require( 'dotenv' ).config();

const app=express();
app.use( express.json() );
// const corsOptions={
//     origin: 'https://admirable-puppy-810ad2.netlify.app',
//     credentials: true
// };

const corsOptions={
    origin: ['https://reactapp-minifront.netlify.app', 'https://admirable-puppy-810ad2.netlify.app'],
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // If your frontend sends cookies or uses HTTP authentication headers
};

app.use( cors( corsOptions ) );

// Additional CORS configurations as needed



// Read existing contents of .env file
let envContents='';
try {
    envContents=fs.readFileSync( '.env', 'utf8' );
} catch ( err ) {
    // File might not exist yet, which is okay
}
// Check if SESSION_SECRET_KEY already exists
if ( !envContents.includes( 'SESSION_SECRET_KEY' ) ) {
    // Generate a random secret
    const secret=crypto.randomBytes( 64 ).toString( 'hex' );
    // Append the new secret to the existing contents
    envContents+=`\nSESSION_SECRET_KEY=${ secret }\n`;
    // Write the updated contents back to the .env file
    fs.writeFileSync( '.env', envContents );
    console.log( 'Secret generated and appended to .env file.' );
} else {
    console.log( 'SESSION_SECRET_KEY already exists in .env file. Skipping generation.' );
}


app.use( session( {
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create( {
        mongoUrl: process.env.MONGO_URI,
        dbName: 'project-session-db',
        autoRemove: 'native' // Enable automatic removal of expired sessions
    } ),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: 'none'
    }
}, ( err ) => {
    if ( err ) {
        console.error( 'Session store error:', err );
    }
} ) );


mongoose.set( 'strictQuery', false );
const mongoDbURL=process.env.MONGO_URI;
main().catch( err => {
    console.log( err )
} )
async function main() {
    await mongoose.connect( mongoDbURL )
}
//app.use( '/reg', router )
const mongoDb=mongoose.connection;
mongoDb.on( 'error', err => {
    console.log( err )
} )
mongoDb.once( 'open', () => {
    console.log( 'Connection successfullly opened to MongoDb NoSQL' )
} )
// mongoDb.createCollection( 'UserDetails' )
// app.use( '/reg', router )
// app.use( '/user', router )
// app.use( '/friend', friendRouter )
// app.use( '/msg', postRouter )
// app.use( '/heart', likeRouter )

app.use( '/api', indexRoute )

const PORT=process.env.PORT;
app.listen( PORT, () => {
    console.log( `Server is listening on the port${ PORT }` )
} )

module.exports=app;