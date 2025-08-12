import { Model, Sequelize } from "sequelize"
import Post  from "../../../DB/Models/post.model.js"
import { User } from "../../../DB/Models/user.model.js"
import Comment from "../../../DB/Models/comment.model.js"
import { sequelize_config } from "../../../DB/db.connection.js"



export const createPost = async (req,res)=>{
    try {

        const {title , content , userId }= req.body
        
        if (!title || !content || !userId) {
            return res.status(400).json({
                success:false,
                message: 'all data needed for creating post'
            })
        }

        const post = Post.build({title , content , fkUserId:userId })

        await post.save()

        return res.status(201).json({
            success: true,
            message: 'post created successfully',
            data: {post}
        })

    } catch (error) {

        if (error?.name === 'SequelizeForeignKeyConstraintError' || error?.parent?.errno == 1452) {
            return res.status(400).json({
                success: false,
                message: "author of post was not found between users",
                error: {
                    name: error.name,       
                    message: error.message, 
                    details: error.errors,
                    error  
                } 
            })
        }



        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                name: error.name,       
                message: error.message, 
                details: error.errors  
            } 
        })
    }
}


export const deletePost = async (req,res)=>{
    try {

        const postId= req.params.postId
        const userId= req.params.userId



        
        if (!postId || !userId) {
            return res.status(400).json({
                success:false,
                message: 'post id and author id are required for deleting post'
            })
        }


        if (isNaN(postId) || isNaN(userId)) return res.status(400).json({
                                                success:false,
                                                message: 'post id or author id type is not valid'
                                            })




        const post = await Post.findByPk(postId);

        if (!post) return res.status(404).json({
                        success: false,
                        message: "post not found", 
                    })

        // enforce ownership
        if (Number(post.fkUserId) !== Number(userId)) {
            return res.status(403).json({
                success: false,
                message: 'forbidden: user not authorized to delete this post'
            })
        }

        const action = await post.destroy()

        // use 200 and include body (avoid 204 with body)
        return res.status(200).json({
            success: true,
            message: 'post deleted successfully',
            deleted_records: action
        })

    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                name: error.name,       
                message: error.message, 
                details: error.errors  
            } 
        })
    }
}



export const getAllPosts = async (req,res)=>{
    try {


        const postData = await Post.findAll({
            attributes:['id','title'],

            include:[
                { model : User , as:'post_author_data' ,attributes:['id','name']},
                { model : Comment , as:'post_comments_data' ,attributes:['id','content']}
            ],
            order: [[{ model: Comment, as: 'post_comments_data' }, 'createdAt', 'DESC']]
        })

        if (!postData) return res.status(500).json({
                        success: false,
                        message: "posts details not found,something went wrong", 
                    })



        return res.status(200).json({
            success: true,
            message: 'posts details retrived successfully',
            data:{postData}
        })

    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                name: error.name,       
                message: error.message, 
                details: error.errors  
            } 
        })
    }
}


export const getpostCommentCount = async (req,res)=>{
    try {


        const postData = await Post.findAll({
            attributes:['id','title',
                [sequelize_config.fn('count',sequelize_config.col('post_comments_data.id',)),'commentCount']
            ],

            include:[
                { model : Comment , as:'post_comments_data' ,attributes:[],required:false}
            ],
            group:['Post.id'],
            raw:true
        },
        )

        if (!postData) return res.status(500).json({
                        success: false,
                        message: "posts details not found,something went wrong", 
                    })



        return res.status(200).json({
            success: true,
            message: 'posts details retrived successfully',
            data:{postData}
        })

    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: {
                name: error.name,       
                message: error.message, 
                details: error.errors  
            } 
        })
    }
}














