export const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.json({
                success:false,
                message:"access denied"
            })
        }
        next()
    }
}

