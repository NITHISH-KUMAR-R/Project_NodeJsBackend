const mongoDb=require( '../Schema/userData' );

const verifySession=async ( req, res, next ) => {
    try {
        if ( !req.session ) {
            return res.status( 401 ).send( "Please login, no session exists" );
        }
        if ( !req.session.userSession||!req.session.userSession.Userid ) {
            return res.status( 401 ).send( "No session userId  found in session cookie menans cookies cleared from postman" );
        }

        const user_ID=req.session.userSession.Userid;
        console.log( user_ID );

        const userValidation=await mongoDb.findById( user_ID ).exec();
        console.log( userValidation._id );

        if ( !userValidation ) {
            return res.status( 400 ).send( "User not found for this session id" );
        }

        next(); // Call next middleware if everything is fine
    } catch ( err ) {
        console.error( err );
        res.status( 500 ).send( "Internal session server error" );
    }
}

module.exports={ verifySession };
