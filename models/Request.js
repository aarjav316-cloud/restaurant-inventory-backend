import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    item:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["pending" , "approved" , "rejected"],
        default:"pending"
    }
},{timestamps:true})


requestSchema.index({status:1})
requestSchema.index({requestedBy:1})


const Request = mongoose.model("Request" , requestSchema)

export default Request;
