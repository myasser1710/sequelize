'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. Check if column exists (without creating it)
    const [columns] = await queryInterface.sequelize.query(
      `SHOW COLUMNS FROM Posts LIKE 'fkUserId'`
    );

    if (columns.length === 0) {
      throw new Error('Column fkUserId does not exist in Posts table');
    }

    // 2. Remove any existing FK constraints
    const [existingFks] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_NAME = 'Posts'
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      AND CONSTRAINT_SCHEMA = '${queryInterface.sequelize.config.database}'
    `);
    
    for (const fk of existingFks) {
      await queryInterface.removeConstraint('Posts', fk.CONSTRAINT_NAME);
    }

    // 3. Add new properly named constraint
    await queryInterface.addConstraint('Posts', {
      fields: ['fkUserId'],
      type: 'foreign key',
      name: 'fk_post_user',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Posts', 'fk_post_user');
  }
};





// create new migration 
//npx sequelize-cli migration:generate --name migration_file_name

// Run migrations:
// npx sequelize-cli db:migrate
// 
// Rollback last migration:
// npx sequelize-cli db:migrate:undo
// 
// Rollback all migrations:
// npx sequelize-cli db:migrate:undo:all
// 
// 