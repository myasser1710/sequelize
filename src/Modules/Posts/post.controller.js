import { Router  } from "express";
import { body, param, validationResult } from "express-validator";
const postController = Router()

import * as postServices from './Services/post.service.js'

// validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() })
  }
  next()
}

postController.post(
  '',
  [
    body('title').isString().trim().isLength({ min: 1 }),
    body('content').isString(),
    body('userId').isInt()
  ],
  validate,
  postServices.createPost
)

postController.delete(
  '/:postId/user/:userId',
  [ param('postId').isInt(), param('userId').isInt() ],
  validate,
  postServices.deletePost
)

postController.get('/details',postServices.getAllPosts)
postController.get('/comment-count',postServices.getpostCommentCount)




export default postController




