const express=require( 'express' );
const likeCOntroller=require( '../Controller/postLikesDislikes' );
const middleware=require( '../Middleware/authentication' )
const { verifySession }=require( '../Middleware/authentication' );

const likesRouter=express.Router();
likesRouter.post( '/likes/:pid', middleware.verifySession, likeCOntroller.like )
likesRouter.post( '/dislike/:pid', middleware.verifySession, likeCOntroller.dislike )

module.exports=likesRouter