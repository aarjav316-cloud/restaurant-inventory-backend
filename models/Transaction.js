import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({

    item:{
        type:String,
        required:true
    },

    quantity:{
        type:Number,
        required:true
    },

    action:{
        type:String,
        enum:["ADD","USE","REQUEST"],
        required:true
    },

    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})



transactionSchema.index({createdAt:-1})
transactionSchema.index({item:1})

const Transaction = mongoose.model("Transaction",transactionSchema)

export default Transaction


