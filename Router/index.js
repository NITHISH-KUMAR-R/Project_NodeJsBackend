const routerr=require( './userRouter' )
const friendRouter=require( './friendRouter' )
const postRouter=require( './postRouter' )
const likeRouter=require( './likeDisLikeRouter' )

const express=require( 'express' )

const router=express.Router();


router.use( '/reg', routerr )
router.use( '/user', routerr )
router.use( '/friend', friendRouter )
router.use( '/msg', postRouter )
router.use( '/heart', likeRouter )

module.exports=router