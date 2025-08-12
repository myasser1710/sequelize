import 'dotenv/config'
import express from 'express'
const app = express()

import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import {dbConnection,dbSchemaEditing} from './DB/db.connection.js'
import userController from './Modules/Users/user.controller.js'
import postController from './Modules/Posts/post.controller.js'
import commentController from './Modules/Comments/comment.controller.js'






app.use(express.json())


app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))


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

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))









