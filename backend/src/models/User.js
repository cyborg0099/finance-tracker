// User model using in-memory storage for demonstration. Replace with DB integration as needed.
const users = [];
let idCounter = 1;

class User {
  constructor(data) {
    this.id = idCounter++;
    this.email = data.Email;
    this.password = data.Password; // In production, hash this!
    this.confirmPassword = data.ConfirmPassword;
    this.firstName = data.FirstName || '';
    this.lastName = data.LastName || '';
    this.createdAt = new Date();
  }
}

module.exports = {
  users,
  User
};
