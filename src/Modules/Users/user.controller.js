import { Router } from "express";
const userController = Router()

import * as userServices from './Services/user.service.js'

userController.post('/create-user',userServices.createUser)

userController.put('/create-or-update/:id',userServices.createOrUpdate)

userController.get('/find-by-email',userServices.findByEmail)

userController.get('/find-by-pk/:id',userServices.findByPk)


export default userController