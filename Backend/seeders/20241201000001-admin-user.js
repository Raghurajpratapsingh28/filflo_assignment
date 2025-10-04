'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminHashedPassword = await bcrypt.hash('admin123', 12);
    const managerHashedPassword = await bcrypt.hash('raghuraj', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        hashed_password: adminHashedPassword,
        email: 'admin@inventory.com',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'manager',
        hashed_password: managerHashedPassword,
        email: 'manager@inventory.com',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      username: ['admin', 'manager']
    });
  }
};
