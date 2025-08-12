import {Sequelize} from "sequelize"




const DB_NAME = process.env.DB_NAME || 'assignment_six'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASS = process.env.DB_PASS || '1234'
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_DIALECT = process.env.DB_DIALECT || 'mysql'
const DB_LOGGING = process.env.DB_LOGGING || (process.env.NODE_ENV === 'development' ? 'sql' : 'none')

export const sequelize_config = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: DB_LOGGING === 'sql' ? (log)=>console.log('sequelize : ',log) : false
})

//export const sequelize_config = new Sequelize('mysql://root:1234@localhost/Assignment_six')


export const dbConnection = async ()=>{
    try {
        await sequelize_config.authenticate()
        console.log('DB connection success');
        
    } catch (error) {
        console.log('DB connection failed',error);
    }
}




// ------------------------------------------------------------------------------------------------------

// only use this when making changes in schema to avoid duplicate creations while developing
// one time execute calling for applying changes and then remove the calling to avoid duplication (no nodemon)


export const dbSchemaEditing = async ()=>{
    try {
        await sequelize_config.sync({alter: true,force:false})     //=======> only for changing data schema 
        console.log('DB schema changes applied successfully');
        
    } catch (error) {
        console.log('DB schema changes failed',error);
    }
}



