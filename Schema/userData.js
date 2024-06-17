const mongoose=require( 'mongoose' )

const Schema=mongoose.Schema;

const userRegSchema=new Schema( {
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    date: { type: Date, default: Date.now } // Assuming 'Date' is the field for the creation date
} )

module.exports=mongoose.model( 'UserRegDetails', userRegSchema )