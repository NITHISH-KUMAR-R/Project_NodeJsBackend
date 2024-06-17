const express=require( 'express' );
const mongoose=require( 'mongoose' );
const session=require( 'express-session' );
const MongoStore=require( 'connect-mongo' );
const fs=require( 'fs' );
const crypto=require( 'crypto' );
const cors=require( 'cors' );
require( 'dotenv' ).config();

const indexRoute=require( './Router/index' );

const app=express();
app.use( express.json() );

const corsOptions={
    origin: ['https://mini-x-server-bongfynfj-web-builders-projects-b1137b3d.vercel.app', 'https://another-allowed-origin.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use( cors( corsOptions ) );

// Session middleware
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

// MongoDB connection
mongoose.set( 'strictQuery', false );
const mongoDbURL=process.env.MONGO_URI;

async function main() {
    try {
        await mongoose.connect( mongoDbURL );
        console.log( 'Connection successfully opened to MongoDB' );
    } catch ( err ) {
        console.error( 'MongoDB connection error:', err );
    }
}

main();

// Routes
app.use( '/api', indexRoute );

const PORT=process.env.PORT||3000;
app.listen( PORT, () => {
    console.log( `Server is listening on port ${ PORT }` );
} );

module.exports=app;
