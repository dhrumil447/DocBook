const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function updatePasswords() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Update admin password
  const adminPassword = '12345678';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  
  console.log('🔐 Admin password:', adminPassword);
  console.log('🔒 Admin hash:', adminHash);

  await connection.execute(
    'UPDATE patients SET password = ? WHERE email = ?',
    [adminHash, 'admin@docbook.com']
  );

  console.log('✅ Admin password updated!');
  console.log('📧 Email: admin@docbook.com');
  console.log('🔑 Password:', adminPassword);

  // Update doctor password
  const doctorPassword = '123456789';
  const doctorHash = await bcrypt.hash(doctorPassword, 10);
  
  console.log('\n🔐 Doctor password:', doctorPassword);
  console.log('🔒 Doctor hash:', doctorHash);

  await connection.execute(
    'UPDATE doctors SET password = ? WHERE email = ?',
    [doctorHash, 'd@gmail.com']
  );

  console.log('✅ Doctor password updated!');
  console.log('📧 Email: d@gmail.com');
  console.log('🔑 Password:', doctorPassword);

  await connection.end();
}

updatePasswords().catch(console.error);
