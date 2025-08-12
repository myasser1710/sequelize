import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
const commentController = Router()

import * as commentsSerices from './Services/comment.service.js'

// validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() })
  }
  next()
}

commentController.post(
  '',
  [
    body('comments').isArray({ min: 1 }),
    body('comments.*.content').isString().trim().isLength({ min: 1 }),
    body('comments.*.fkPostId').isInt(),
    body('comments.*.fkUserId').isInt()
  ],
  validate,
  commentsSerices.createBulk
)

commentController.patch(
  '/:commentId',
  [
    param('commentId').isInt(),
    body('userId').isInt(),
    body('updateContent').isString().trim().isLength({ min: 1 })
  ],
  validate,
  commentsSerices.updateComment
)

commentController.post(
  '/find-or-create',
  [
    body('postId').isInt(),
    body('userId').isInt(),
    body('content').isString().trim().isLength({ min: 1 })
  ],
  validate,
  commentsSerices.findOrCreate
)

commentController.get(
  '/search',
  [ query('word').isString().trim().isLength({ min: 1 }) ],
  validate,
  commentsSerices.searchInContent
)

commentController.get(
  '/newest/:postId',
  [ param('postId').isInt() ],
  validate,
  commentsSerices.getMostRecent
)

commentController.get(
  '/details/:commentId',
  [ param('commentId').isInt() ],
  validate,
  commentsSerices.findCommentDetails
)



export default commentController
