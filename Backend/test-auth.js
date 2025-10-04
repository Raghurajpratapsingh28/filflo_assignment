const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('./config/config.js');

async function testAuth() {
  const sequelize = new Sequelize(config.development);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Get the manager user with password hash
    const [results] = await sequelize.query(
      "SELECT id, username, hashed_password FROM users WHERE username = 'manager'"
    );
    
    if (results.length === 0) {
      console.log('Manager user not found!');
      return;
    }
    
    const user = results[0];
    console.log('User found:', { id: user.id, username: user.username });
    console.log('Password hash:', user.hashed_password);
    
    // Test password comparison
    const password = 'manager123';
    const isValid = await bcrypt.compare(password, user.hashed_password);
    console.log('Password "manager123" is valid:', isValid);
    
    // Test with different variations
    const variations = ['Manager123', 'MANAGER123', 'manager 123', 'manager123 '];
    for (const variation of variations) {
      const isValidVar = await bcrypt.compare(variation, user.hashed_password);
      console.log(`Password "${variation}" is valid:`, isValidVar);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

testAuth();
