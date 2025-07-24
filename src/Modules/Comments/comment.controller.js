import { Router } from "express";
const commentController = Router()

import * as commentsSerices from './Services/comment.service.js'


commentController.post('',commentsSerices.createBulk)
commentController.patch('/:commentId',commentsSerices.updateComment)
commentController.post('/find-or-create',commentsSerices.findOrCreate)
commentController.get('/search',commentsSerices.searchInContent)
commentController.get('/newest/:postId',commentsSerices.getMostRecent)
commentController.get('/details/:commentId',commentsSerices.findCommentDetails)



export default commentController
