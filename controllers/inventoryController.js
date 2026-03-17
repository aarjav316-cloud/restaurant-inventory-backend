import Inventory from "../models/Inventory.js";
import { redisClient } from "../config/redis.js";
import Transaction from "../models/Transaction.js";

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



export const getInventory = async (req,res) => {
    try {

        const cachedData = await redisClient.get("inventory:all")

        if(cachedData){
            return res.status(200).json({
                success:true,
                source:"redis",
                data:JSON.parse(cachedData)
            })
        }

        const inventory = await Inventory.find()

        await redisClient.set(
            "inventory:all",
            JSON.stringify(inventory),
            {EX:60}
        )

        return res.status(200).json({
            success:true,
            source:"database",
            data:inventory
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const updateInventory = async (req,res) => {
    try {

        const {id} = req.params;
        const {quantity} = req.body;

        const updated = await Inventory.findByIdAndUpdate(
            id,
            {quantity},
            {new:true}
        )

        if(!updated){
            return res.status(404).json({
                success:false,
                message:"item not found"
            })
        }

        await redisClient.del("inventory:all")

        return res.status(200).json({
            success:true,
            message:"Inventory updated",
            data:updated
        })
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}


export const useMaterial = async(req,res) => {
    try {

        const {itemName , quantity} = req.body;

        if(!itemName || !quantity){
            return res.status(400).json({
                success:false,
                message:"Item and quantity required"
            })
        }

        const item = await Inventory.findOne({itemName})

        if(!item){
            return res.status(404).json({
                success:false,
                message:"Item not found"
            })
        }

        if(item.quantity < quantity){
            return res.status(400).json({
                success:false,
                message:"Not enough stock"
            })
        }

        item.quantity -= quantity;
        await item.save()

        await Transaction.create({
            item:itemName,
            quantity,
            action: "USE",
            performedBy:req.user.id
        })

        return res.json({
            success:true,
            message:"Material used successfully"
        })
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}

