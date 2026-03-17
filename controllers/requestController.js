import Request from "../models/Request.js";
import Inventory from "../models/Inventory.js";
import Transaction from "../models/Transaction.js";
import { redisClient } from "../config/redis.js";



export const createRequest = async (req,res) => {
    try {

        const {item , quantity} = req.body;

        if(!item || !quantity){
            return res.status(400).json({
                success:false,
                message:"insufficient details"
            })
        }

        const request = await Request.create({
            item,
            quantity,
            requestedBy:req.user.id
        })

        return res.status(201).json({
            success:true,
            message:"Request created successfully",
            data:request
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



export const getRequests = async (req, res) => {
    try {
  
      let requests
  
      
      if (req.user.role === "admin") {
        requests = await Request.find().populate("requestedBy", "name email")
      }
  
      
      else {
        requests = await Request.find({ requestedBy: req.user.id })
      }
  
      return res.status(200).json({
        success: true,
        data: requests
      })
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }