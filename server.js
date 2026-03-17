import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import connectRedis from './config/redis.js'
import connectDB from './config/db.js'

import authRoutes from './routes/auth.routes.js'
import inventoryRoutes from './routes/inventory.routes.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

connectDB();
connectRedis();


app.use('/api/auth' , authRoutes)
app.use('/api/inventory' , inventoryRoutes)

app.get("/" , (req,res) => {
    res.send(`server running on port ${PORT}`)
})

const PORT = process.env.PORT || 5000

app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`)
})

