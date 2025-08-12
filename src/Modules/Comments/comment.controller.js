import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
const commentController = Router()

import * as commentsServices from './Services/comment.service.js'

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
  commentsServices.createBulk
)

commentController.patch(
  '/:commentId',
  [
    param('commentId').isInt(),
    body('userId').isInt(),
    body('updateContent').isString().trim().isLength({ min: 1 })
  ],
  validate,
  commentsServices.updateComment
)

commentController.post(
  '/find-or-create',
  [
    body('postId').isInt(),
    body('userId').isInt(),
    body('content').isString().trim().isLength({ min: 1 })
  ],
  validate,
  commentsServices.findOrCreate
)

commentController.get(
  '/search',
  [ query('word').isString().trim().isLength({ min: 1 }) ],
  validate,
  commentsServices.searchInContent
)

commentController.get(
  '/newest/:postId',
  [ param('postId').isInt() ],
  validate,
  commentsServices.getMostRecent
)

commentController.get(
  '/details/:commentId',
  [ param('commentId').isInt() ],
  validate,
  commentsServices.findCommentDetails
)



export default commentController
