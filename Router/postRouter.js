const express=require( 'express' )
const postController=require( '../Controller/postController' )
const middleware=require( '../Middleware/authentication' )
const postapiRouter=express.Router();



postapiRouter.post( '/post', middleware.verifySession, postController.userPost )
postapiRouter.get( '/all', middleware.verifySession, postController.geloginUserPost )
postapiRouter.get( '/allUserspost', middleware.verifySession, postController.allUserPost )
postapiRouter.delete( '/delPost/:id', middleware.verifySession, postController.deleteUserPost )

module.exports=postapiRouter