import { Router  } from "express";
const postController = Router()

import * as postServices from './Services/post.service.js'


postController.post('',postServices.createPost)
postController.delete('/:postId/user/:userId',postServices.deletePost)
postController.get('/details',postServices.getAllPosts)
postController.get('/comment-count',postServices.getpostCommentCount)




export default postController




