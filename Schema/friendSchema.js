const mongoose=require( 'mongoose' )

const Schema=mongoose.Schema;

const friendSchema=new Schema( {
    username: { type: String, require: true, unique: true },
    userid: { type: String, require: true, },
    friendList: [{ user_id: String, fName: String, fEmail: String }],
    date: { type: Date, default: Date.now } // Assuming 'Date' is the field for the creation date
} )

module.exports=mongoose.model( 'friendListDb', friendSchema )