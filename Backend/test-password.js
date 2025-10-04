const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'manager123';
  const hash = '$2a$12$0LlkwkIFmyUs/gutmYpPWOi0GI3JrgeoFP9NtErJUHt1oEpdyEocm';
  
  console.log('Testing password:', password);
  console.log('Hash from database:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password valid:', isValid);
  
  // Test with a fresh hash
  const newHash = await bcrypt.hash(password, 12);
  console.log('New hash:', newHash);
  
  const isValidNew = await bcrypt.compare(password, newHash);
  console.log('New hash valid:', isValidNew);
}

testPassword().catch(console.error);
