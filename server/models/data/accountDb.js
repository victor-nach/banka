const accounts = [
  {
    id: 1,
    accountNumber: 111500789,
    createdOn: new Date(),
    owner: 1,
    type: 'savings',
    cashier: 2,
    status: 'active',
    balance: 510000.00,
  },
  {
    id: 2,
    accountNumber: 111600789,
    createdOn: new Date(),
    owner: 2,
    type: 'current',
    cashier: 2,
    status: 'active',
    balance: 510000.00,
  },
  {
    id: 3,
    accountNumber: 111700789,
    createdOn: new Date(),
    owner: 4,
    type: 'current',
    cashier: 2,
    status: 'draft',
    balance: 510000.00,
  },
  {
    id: 4,
    accountNumber: 111800789,
    createdOn: new Date(),
    owner: 3,
    type: 'current',
    cashier: 2,
    status: 'dormant',
    balance: 510000.00,
  },
];

export default accounts;
