import { Op } from "sequelize"
import Comment from "../../../DB/Models/comment.model.js"
import Post from "../../../DB/Models/post.model.js"
import { User } from "../../../DB/Models/user.model.js"

export const createBulk = async (req, res) => {
  try {
    const { comments } = req.body

    if (!comments)
      return res.status(400).json({
        success: false,
        message: "comments data needed for bulk creating",
      })

    

    const created = await Comment.bulkCreate(comments, { validate: true })

    if (!created.length) {
      return res.status(400).json({
        success: false,
        message: "comment not created ",
      })
    }

    return res.status(201).json({
      success: true,
      message: "post created successfully",
      data: { created },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    })
  }
}

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId
    const { userId } = req.body
    const { updateContent } = req.body

    if (isNaN(commentId) || !commentId)
      return res.status(400).json({
        success: false,
        message: "valid params are needed (comment id)",
      })

    if (!userId || !updateContent) {
      return res.status(400).json({
        success: false,
        message:
          "comment id , author id and content are required for updating comment",
      })
    }

    if (isNaN(userId) || typeof updateContent !== "string")
      return res.status(400).json({
        success: false,
        message: "comment id or author id or content data type is not valid",
      })

    const updatedComment = await Comment.update(
      { content: updateContent },
      {
        where: {
          id: commentId,
          fkUserId: userId,
        },
      }
    )

    if (updatedComment[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "comment not found or unauthorized user",
      })
    }

    return res.status(200).json({
      success: true,
      message: "comment updated successfully",
      affected_rows: updatedComment[0],
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    })
  }
}

export const findOrCreate = async (req, res) => {
  try {
    const { postId, userId, content } = req.body

    if (!postId || !userId || !content) {
      return res.status(400).json({
        success: false,
        message:
          "comment id , author id and content are required for finding or creating comment",
      })
    }

    if (isNaN(postId) || isNaN(userId) || typeof content !== "string")
      return res.status(400).json({
        success: false,
        message: "request data types are not valid",
      })

    const [instance, created] = await Comment.findOrCreate({
      where: { fkUserId: userId, fkPostId: postId, content },
    })

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created
        ? "comment created successfully"
        : "comment instance retrived successfully",
      data: instance,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    })
  }
}




export const searchInContent = async (req, res) => {
  try {
    const searchContent = req.query.word

    if (typeof searchContent !== "string" || !searchContent)
      return res.status(400).json({
        success: false,
        message: "valid params are needed (word)",
      })

      
    const { count, rows:comments } = await Comment.findAndCountAll({
      where: { content: { [Op.like]: `%${searchContent}%` } },
    })

    return res.status(200).json({
      success: true,
      message: "search results retrived successfully",
      affected_rows: { count , comments },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    })
  }
}



export const getMostRecent = async (req, res) => {

  try {
    const {postId} = req.params

    if (isNaN(postId) || !postId)
      return res.status(400).json({
        success: false,
        message: "valid params are needed (post id)",
      })

      
    const recentComments= await Comment.findAll({
      where: { fkPostId:postId },
      order:[['createdAt','DESC']],
      limit:3
    })

    if (recentComments.length==0) {
      const checkId =await Post.findByPk(postId) 
      if (!checkId) {
        return res.status(404).json({
          success: false,
          message: "Post doesnt exist ",
        })
      }else     return res.status(404).json({
                  success: false,
                  message: "post doesnt have nay comments",
                })
    }

    return res.status(200).json({
      success: true,
      message: "recent comments retrived successfully",
      recentComments
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors,
      },
    })
  }
}




export const findCommentDetails = async (req,res)=>{
    try {

      const {commentId} = req.params

      if (isNaN(commentId))
        return res.status(400).json({
          success: false,
          message: "valid params are needed (comment id)",
        })

        const commentData = await Comment.findByPk(commentId,{
          attributes:['id','content'],
          include:[
              { model : User , as:'comment_author_data' ,attributes:['id','name','email']},
              { model : Post , as:'post_data' ,attributes:['id','title','content'],paranoid:false}
          ]}
        )

        if (!commentData) return res.status(404).json({
                              success: false,
                              message: "comment not found", 
                          })



        return res.status(200).json({
            success: true,
            message: 'comment details retrived successfully',
            data:{commentData}
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







