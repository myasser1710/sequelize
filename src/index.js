import express from 'express'
const app = express()

import {dbConnection} from './DB/db.connection.js'
import { dbSchemaEditing } from './DB/db.connection.js'

import userController from './Modules/Users/user.controller.js'
import postController from './Modules/Posts/post.controller.js'
import commentController from './Modules/Comments/comment.controller.js'


// import { User } from './DB/Models/user.model.js'
// import Post from './DB/Models/post.model.js'
// import Comment from './DB/Models/comment.model.js'



app.use(express.json())


app.use('/users',userController)

app.use('/posts',postController)

app.use('/comments',commentController)

await dbConnection()

// await dbSchemaEditing()





app.use((req,res,next)=>{
    res.status(404).json({
        message:'Router not found'
    })
})


app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).json({
        message:'something went wrong'
    })
})

app.listen(3000,()=>console.log('server is running on port 3000'))









