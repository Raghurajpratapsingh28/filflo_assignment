'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      hashed_password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'user'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jwl_part: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      customer_part: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      uom: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      batch: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      mfg_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      exp_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      weight: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      ageing_days: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      days_to_expiry: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create indexes
    await queryInterface.addIndex('inventories', ['batch']);
    await queryInterface.addIndex('inventories', ['jwl_part']);
    await queryInterface.addIndex('inventories', ['mfg_date']);
    await queryInterface.addIndex('inventories', ['exp_date']);
    await queryInterface.addIndex('inventories', ['batch', 'jwl_part'], { unique: true });
    await queryInterface.addIndex('users', ['username'], { unique: true });
    await queryInterface.addIndex('users', ['email'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventories');
    await queryInterface.dropTable('users');
  }
};
