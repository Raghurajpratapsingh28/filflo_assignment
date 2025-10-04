const { Sequelize } = require('sequelize');
const config = require('./config/config.js');

async function checkUser() {
  const sequelize = new Sequelize(config.development);
  
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Check if manager user exists
    const [results] = await sequelize.query(
      "SELECT id, username, email, role, created_at FROM users WHERE username = 'manager'"
    );
    
    console.log('Manager user:', results);
    
    if (results.length === 0) {
      console.log('Manager user not found!');
    } else {
      console.log('Manager user found:', results[0]);
    }
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkUser();
