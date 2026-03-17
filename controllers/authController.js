import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req,res) => {
    try {

        const {name , email , password , role} = req.body;

        if(!name || !email || !password || !role){
            return res.json({
                success:false,
                message:"insufficient credentials"
            })
        }

        const existingUser = await User.findOne(email);

        if(existingUser){
            return res.json({
                success:false,
                message:"user already exists"
            })
        }

         const hashPassword = await bcrypt.hash(password , 10);
         
         const user = await User.create({
            name,
            email,
            role,
            password:hashPassword
         })

         return res.json({
            success:true,
            message:"user created successfully",
            user
         })
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}


export const login = async (req,res) => {
    try {

        const {email , password } = req.body;

        if(!email || !password){
            return res.json({
                success:false,
                message:"insufficient details"
            })
        }

        const user = await User.findOne(email)

        if(!user){
            return res.json({
                success:false,
                message:"user does not exists"
            })
        }

        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.json({
                success:false,
                message:"incorrect password enter a correct one"
            })
        }

        const token =  jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        return res.json({
            success:true,
            message:"user logged in successfully",
            token
        })
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}


