const bcrypt = require('bcryptjs');
const db = require('./db');

const saltRounds = 10;

module.exports = {
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const userId = 'USR' + Math.floor(Math.random() * 10000);
    
    await db.query(
        `INSERT INTO Users (name, email, password, phone)
         VALUES (?, ?, ?, ?)`,
        [userData.name, userData.email, hashedPassword, userData.phone]
      );
      
    return userId;
  },

  async login(email, password) {
    const [user] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (!user) return null;
    
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
};