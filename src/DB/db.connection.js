import {Sequelize} from "sequelize"




export const sequelize_config = new Sequelize('Assignment_six','root','1234',{
    host:'localhost',
    dialect:'mysql',
    logging:(log)=>console.log('sequelize : ',log)
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



