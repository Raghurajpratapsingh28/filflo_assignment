'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update existing users to have proper roles
    await queryInterface.bulkUpdate('users', 
      { role: 'manager' }, 
      { username: 'manager' }
    );
    
    await queryInterface.bulkUpdate('users', 
      { role: 'employee' }, 
      { username: 'admin' }
    );
    
    // Update the role column to be NOT NULL with proper validation
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'employee',
      validate: {
        isIn: [['manager', 'employee']]
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the role column changes
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: 'user'
    });
  }
};
