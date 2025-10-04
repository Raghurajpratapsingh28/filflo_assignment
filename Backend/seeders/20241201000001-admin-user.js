'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const managerHashedPassword = await bcrypt.hash('manager123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'manager',
        hashed_password: managerHashedPassword,
        email: 'manager@inventory.com',
        role: 'manager',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      username: ['manager']
    });
  }
};
