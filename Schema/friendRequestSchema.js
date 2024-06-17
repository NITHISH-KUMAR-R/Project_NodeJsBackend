const mongoose=require( 'mongoose' );
const Schema=mongoose.Schema;

const FriendReqSchema=new Schema( {
    sender: { type: Schema.Types.ObjectId, ref: 'UserRegDetails' },
    receiver: { type: Schema.Types.ObjectId, ref: 'UserRegDetails' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
} );

module.exports=mongoose.model( 'FriendRequest', FriendReqSchema );
