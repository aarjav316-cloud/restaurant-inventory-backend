import express from 'express'
import { 
    addInventory,
    getInventory,
    updateInventory,
    useMaterial
} from '../controllers/inventoryController.js'


import {protect} from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router();

router.post("/add" , protect , authorizeRoles("admin"), addInventory)
router.get("/",protect, getInventory )
router.put("/update/:id" , protect , authorizeRoles("admin") , updateInventory)
router.post("/use",protect,authorizeRoles("chef"),useMaterial)

export default router;




