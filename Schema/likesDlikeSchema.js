const mongoose=require( 'mongoose' )
const Schema=mongoose.Schema;

const likesDslike=new Schema( {
    postId: { type: String },
    likes: { type: String },
    dislikes: { type: String }
} )

module.exports=mongoose.model( 'likeDislikes', likesDslike )
