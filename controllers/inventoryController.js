import Inventory from "../models/Inventory.js";
import { redisClient } from "../config/redis.js";

export const addInventory = async(req,res) => {
    try {

        const {itemName,quantity,unit} = req.body

        if(!itemName || !quantity || !unit){
            return res.status(400).json({
                success:false,
                message:"insufficient details"
            })
        }

        const item = await Inventory.create({
            itemName,
            quantity,
            unit
        })

        await redisClient.del("inventory:all")

        return res.status(201).json({
            success:true,
            message:"item added successfully",
            item
        })

 
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}







