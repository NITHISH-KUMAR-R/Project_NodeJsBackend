const mongodb=require( '../Schema/userData' )
const bcrypt=require( 'bcrypt' )
const saltRounds=10;

const userRegister=async ( req, res ) => {
    const { name, email, password }=req.body;
    const salt=bcrypt.genSaltSync( saltRounds );
    // const hash=bcrypt.hashSync( password, salt );
    const regDetails=new mongodb( {
        username: name, email, password: bcrypt.hashSync( password, salt )
    } )
    try {
        await regDetails.save();

        res.send( 'Successfully Added to DB' )
    } catch ( err ) {
        console.log( err )
        res.status( 500 ).send( 'Internal Server error' )
    }
}

const userLogin=async ( req, res ) => {
    const { email, password }=req.body;
    //const hashpassword=bcrypt.compareSync( myPlaintextPassword, hash ); // true
    try {
        const userDb=await mongodb.findOne( { email: email } ).exec(); // Assuming 'email' is the email address you're searching for
        //console.log( userDb.password )
        if ( !userDb ) {
            console.log( 'user Not found' )
            return res.status( 404 ).send( 'user Not found in DB' )
        }
        // console.log( userDb )
        const isValidPassword=bcrypt.compareSync( password, userDb.password ); // true
        if ( !isValidPassword ) {
            console.log( 'Password incorrect' )
            return res.status( 401 ).send( "Invalid Password" )
        }
        req.session.userSession={ Userid: userDb._id, name: userDb.email } //used to store session ID in userSession in req.session


        console.log( req.session )
        // console.log("User Logg")
        //    const userNameDB = await mongodb.findOne( { email: email } ).exec();
        // console.log( userDb.email )
        return res.send( { message: "User Logged In Successfully", username: userDb.email } );
    } catch ( err ) {
        console.log( err );
        return res.status( 500 ).send( 'Internal server error in password' )
    }
}

const allUserProfile=async ( req, res ) => {
    try {
        const allUsersDb=await mongodb.find().exec();
        console.log( "Length of all users", allUsersDb.length )
        res.send( allUsersDb )

    } catch {
        res.status( 500 ).send( "Internal Server error while fetching all users" )
    }
}

const logout=async ( req, res ) => {
    req.session.destroy( ( err ) => {
        if ( err ) {
            return res.status( 402 ).send( "unable to Logout" )
        }

        res.send( "user Logout successfull" )
    } )
}

const sessionData=async ( req, res ) => {

    try {
        if ( req.session.userSession ) {
            console.log( req.session )
            res.send( req.session.userSession );
        } else {
            res.status( 401 ).send( { error: 'Not authenticated' } );
        }

    }
    catch ( error ) {
        res.status( 500 ).send( "Error while fecthing session data from userSession" )
    }

}

module.exports={ userRegister, userLogin, allUserProfile, logout, sessionData }
