import { DataTypes, ValidationError, ValidationErrorItem } from "sequelize";
import { sequelize_config } from "../db.connection.js";
import bcrypt from 'bcrypt'




export const User = sequelize_config.define('User',
    {
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                len:{
                    args:[3,255],
                    msg:'Name must be at least 3 characters'
                }
            }
        },

        email:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{isEmail:true}
        },

        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                checkPasswordLength(value){
                    if (value.length <= 6) {
                        throw new Error("password must exceed six characters");
                    }
                }
            }
        },

        role:{
            type:DataTypes.ENUM('user','admin'),
            allowNull:false,
            validate:{
                isIn:{ args: [['user', 'admin']], msg: 'Role must be either user or admin'}
            }
        }
    },
    {
        timestamps:true,
        
        indexes:[
            {
                name:'idx_email_unique',
                unique:true,
                fields:['email']
            }
        ],

        hooks:{

            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }

    }
)










