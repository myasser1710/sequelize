import { DataTypes,Model } from "sequelize"
import { sequelize_config } from "../db.connection.js"
import { User } from "./user.model.js"



class Post extends Model{}

Post.init(
    {
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        content:{
            type:DataTypes.TEXT
        },
        fkUserId:{
            type: DataTypes.INTEGER,
            allowNull: false
        }

    },

    {

        sequelize:sequelize_config,
        modelName:'Post',
        timestamps:true,
        paranoid:true,
        indexes: [
            {
                fields: ['title'],
                name:'posts_title_idx'                                             
            }
        ]
    }
)













Post.belongsTo(User, {
  foreignKey: {
    name: 'fkUserId',
  },
  
  constraints:false,

  as: 'post_author_data'
});



User.hasMany(Post, {
  foreignKey: 'fkUserId',
  constraints: false, 
  as: 'user_posts_data'
});



export default Post



















