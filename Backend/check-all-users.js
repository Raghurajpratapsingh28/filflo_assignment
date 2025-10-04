const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('./config/config.js');

async function checkAllUsers() {
  const sequelize = new Sequelize(config.development);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Get all users
    const [results] = await sequelize.query(
      "SELECT id, username, email, role, created_at FROM users ORDER BY id"
    );
    
    console.log('All users in database:');
    results.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Created: ${user.created_at}`);
    });
    
    // Get manager user with password hash
    const [managerResults] = await sequelize.query(
      "SELECT id, username, hashed_password FROM users WHERE username = 'manager'"
    );
    
    console.log('\nManager users with password hashes:');
    managerResults.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}`);
      console.log(`Hash: ${user.hashed_password}`);
      
      // Test password
      bcrypt.compare('manager123', user.hashed_password).then(isValid => {
        console.log(`Password "manager123" valid: ${isValid}`);
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkAllUsers();
