// Transaction model using in-memory storage for demonstration. Replace with DB integration as needed.
const transactions = [];
let idCounter = 1;

class Transaction {
  constructor(data) {
    this.id = idCounter++;
    this.budgetId = data.budgetId;
    this.amount = Number(data.amount);
    this.type = data.type; // 'income' or 'expense'
    this.category = data.category;
    this.subCategory = data.subCategory;
    this.date = new Date(data.date);
    this.description = data.description || '';
  }
}

module.exports = {
  transactions,
  Transaction
};
