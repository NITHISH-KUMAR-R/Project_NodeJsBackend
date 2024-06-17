const usersPodtModel=require( '../Schema/postSchema' )

const like=async ( req, res ) => {
    const postId=req.params.pid;
    const userid=req.session.userSession.Userid;
    try {
        const postWithMatchingId=await usersPodtModel.findOne( { "messagesList._id": postId } );
        //console.log( postWithMatchingId )
        if ( postWithMatchingId ) {
            // Find the matching post within the messagesList array
            const matchingPost=postWithMatchingId.messagesList.find( message => message._id.toString()===postId );

            if ( matchingPost ) {
                // Matching post found within the messagesList array
                // Handle your logic here
                matchingPost.likes++;
                await postWithMatchingId.save();
                return res.status( 200 ).json( { message: 'Post found.', post: matchingPost } );
            } else {
                // If no post with the provided ID was found within the messagesList array
                return res.status( 404 ).json( { message: 'Post not found within messagesList.' } );
            }
        } else {
            // If no post with the provided ID was found
            return res.status( 404 ).json( { message: 'Post not found.' } );
        }

    } catch ( error ) {
        console.log( error )
        res.status( 500 ).send( "Internal Server Error while Liking Post" )
    }

}

const dislike=async ( req, res ) => {
    const postId=req.params.pid;
    const userId=req.session.userSession.Userid;
    try {
        const postWithMatchingId=await usersPodtModel.findOne( { "messagesList._id": postId } );
        if ( postWithMatchingId ) {
            const matchingPost=postWithMatchingId.messagesList.find( message => message._id.toString()===postId );
            if ( matchingPost ) {
                matchingPost.likes--;
                matchingPost.disLikes++;
                await postWithMatchingId.save();
                return res.status( 200 ).json( { message: 'Post found.', post: matchingPost } );
            } else {
                return res.status( 404 ).json( { message: 'Post not found within messagesList.' } );
            }
        } else {
            return res.status( 404 ).json( { message: 'Post not found.' } );
        }
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).send( "Internal Server Error while Disliking Post" );
    }
}



module.exports={ like, dislike }