const { Sequelize } = require('sequelize');
const config = require('./config/config.js');

async function checkAllUsersDetailed() {
  const sequelize = new Sequelize(config.development);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Get all users with password hashes
    const [results] = await sequelize.query(
      "SELECT id, username, email, role, hashed_password, created_at FROM users ORDER BY id"
    );
    
    console.log('All users in database:');
    results.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Created: ${user.created_at}`);
      console.log(`Hash: ${user.hashed_password}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkAllUsersDetailed();
