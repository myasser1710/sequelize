import { DataTypes,Model } from "sequelize"
import { sequelize_config } from "../db.connection.js"
import { User } from "./user.model.js"
import Post from "./post.model.js"

class Comment extends Model {}


Comment.init(
    {
        content:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        fkPostId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        fkUserId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },

    {
        sequelize:sequelize_config,
        modelName:'Comment',
        timestamps:true
    }
)


Comment.belongsTo(Post,{
    foreignKey:{
        name:'fkPostId'
    },
    constraints:false,
    as:'post_data'
})


Post.hasMany(Comment,{
    foreignKey:{
        name:'fkPostId'
    },
    constraints:false,
    as:'post_comments_data'
})






Comment.belongsTo(User,{
    foreignKey:{
        name:'fkUserId'
    },
    constraints:false,
    as:'comment_author_data'

})


User.hasMany(Comment,{
    foreignKey:{
        name:'fkUserId'
    },
    constraints:false,
    as:'user_comments_data'
})





export default Comment
