import { createClient } from "redis";

export let redisClient

const connectRedis = async () => {
    try {

        redisClient = createClient({
            url:process.env.REDIS_URL
        })

        redisClient.on("error" , (err) => {
            console.log("Redis Error" , err)
        })

        await redisClient.connect()

        console.log("Redis connected")
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}


export default connectRedis

