import jwt from 'jsonwebtoken'
import User from '../models/User.js';

 export const protect = async(req,res,next) => {
    try {

        const auth = req.headers.authorization

        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing or invalid format"
            });
        }

        const token = auth.split(" ")[1];

        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

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

