const transactions = [
  {
    id: 1,
    createdOn: new Date(),
    type: 'credit',
    accountNumber: 111500789,
    cashier: 2,
    amount: 5000.00,
    oldBalance: 505000.00,
    newBalance: 510000.00,
  },
  {
    id: 2,
    createdOn: new Date(),
    type: 'credit',
    accountNumber: 111456789,
    cashier: 3,
    amount: 30000.00,
    oldBalance: 205000.00,
    newBalance: 235000.00,
  },
  {
    id: 3,
    createdOn: new Date(),
    type: 'debit',
    accountNumber: 111233789,
    cashier: 3,
    amount: 50000.00,
    oldBalance: 150000.00,
    newBalance: 100000.00,
  },
];

export default transactions;
