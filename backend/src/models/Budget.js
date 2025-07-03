// Budget model using in-memory storage for demonstration. Replace with DB integration as needed.
const budgets = [];
let idCounter = 1;

class Budget {
  constructor(data) {
    this.id = idCounter++;
    this.name = data.name;
    this.category = data.category;
    this.subCategory = data.subCategory;
    this.allocated = Number(data.amount);
    this.spent = data.spent || 0;
    this.period = data.period;
    this.startDate = new Date(data.startDate);
    this.endDate = data.endDate ? new Date(data.endDate) : null;
    this.rollover = !!data.rollover;
    this.priority = data.priority || 'medium';
    this.notifications = data.notifications || { threshold: 80, frequency: 'weekly' };
  }
}

module.exports = {
  budgets,
  Budget
};
