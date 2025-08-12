import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
const userController = Router()

import * as userServices from './Services/user.service.js'

// validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() })
  }
  next()
}

userController.post(
  '/create-user',
  [
    body('name').isString().trim().isLength({ min: 3 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 7 }),
    body('role').isIn(['user','admin'])
  ],
  validate,
  userServices.createUser
)

userController.put(
  '/create-or-update/:id',
  [
    param('id').isInt(),
    body('name').optional().isString().isLength({ min: 3 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isString().isLength({ min: 7 }),
    body('role').optional().isIn(['user','admin'])
  ],
  validate,
  userServices.createOrUpdate
)

userController.get(
  '/find-by-email',
  [ query('email').isEmail().normalizeEmail() ],
  validate,
  userServices.findByEmail
)

userController.get(
  '/find-by-pk/:id',
  [ param('id').isInt() ],
  validate,
  userServices.findByPk
)


export default userController