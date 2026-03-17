import jwt from 'jsonwebtoken'
import User from '../models/User.js';

const protect = async(req,res,next) => {
    try {

        const auth = req.headers.authorization

        const token = auth.split(" ")[1];

        if(!token){
            return res.json({
                success:false,
                message:"token not found"
            })
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        const user = await User.find(decoded.id)

        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        }

        req.user = user;

        next()
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}