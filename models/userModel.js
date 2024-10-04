const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Function to get all users
function getUsers() {
  const usersData = fs.readFileSync(usersFilePath);
  return JSON.parse(usersData);
}

// Function to save users
function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports = {
  getUsers,
  saveUsers,
};
