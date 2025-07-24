import { columnExists } from '../../Middlewares/column_check.middleware.js'


'use strict'
/** @type {import('sequelize-cli').Migration} */




export default {

  async up(queryInterface, Sequelize) {
    // check if column exists (without creating it)
    const checkColumn = await columnExists('Comments','fkUserId', { queryInterface }) && await columnExists('Comments','fkPostId', { queryInterface })
    
    if (!checkColumn) {
      throw new Error('Required columns (fkUserId, fkPostId) do not exist in Comments table')
    }

    // remove any existing FK constraints
    const [existingFks] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_NAME = 'Comments'
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      AND CONSTRAINT_SCHEMA = '${queryInterface.sequelize.config.database}'
    `)
    
    for (const fk of existingFks) {
      await queryInterface.removeConstraint('Comments', fk.CONSTRAINT_NAME)
        .catch ((error)=>{console.warn(`Failed to remove constraint ${fk.CONSTRAINT_NAME}:`, error)})
    }   
      
    // add new named constraint
    await queryInterface.addConstraint('Comments', {
      fields: ['fkUserId'],
      type: 'foreign key',
      name: 'fk_comment_author',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }).catch((error)=>{ throw new Error('failed to create fk constrain on fkUserId column',error)})


    await queryInterface.addConstraint('Comments', {
      fields: ['fkPostId'],
      type: 'foreign key',
      name: 'fk_comment_post',
      references: {
        table: 'Posts',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }).catch((error)=>{ throw new Error('failed to create fk constrain on fkPostId column',error)})

  },

  async down (queryInterface, Sequelize) {

      try {

        await queryInterface.removeConstraint('Comments', 'fk_comment_author')
        await queryInterface.removeConstraint('Comments', 'fk_comment_post')

      }catch (error) {
        console.error('failed to remove constrains',error)
      }

  }
}
