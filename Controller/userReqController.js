const mongoDb=require( '../Schema/userData' )
const userProfile=async ( req, res ) => {

    const _id=req.query.id;
    console.log( _id )
    try {
        const userDbId=await mongoDb.findById( _id ).exec();
        res.send( userDbId )

    } catch {
        res.status( 500 ).send( "Internal Server Error" )
    }

}
module.exports={ userProfile }