const bcrypt = require('bcryptjs');

// Configuration
const plainPassword = "Admin@123";
const saltRounds = 12; // Security level (higher = slower but more secure)

// Generate hash
const hash = bcrypt.hashSync(plainPassword, saltRounds);

console.log("====================================");
console.log("Plain Password:", plainPassword);
console.log("Generated Hash:", hash);
console.log("====================================");

// Verify the hash works
console.log("Verification:", bcrypt.compareSync(plainPassword, hash));