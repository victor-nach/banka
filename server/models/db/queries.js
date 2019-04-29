export default {
  // Users
  insertUser: 'INSERT INTO users(email, first_name, last_name, hashed_password, type, is_admin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;',
  getSingleUser: 'SELECT * FROM users WHERE email = $1;',
  getUserById: 'SELECT * FROM users WHERE id = $1;',
  updateUserPassword: 'UPDATE users SET hashed_password = $1 WHERE id = $2',

  // Accounts
  insertAccount: 'INSERT INTO accounts (account_number, owner, type, status, balance) VALUES($1, $2, $3, $4, $5) RETURNING *;',
  getSingleAccount: 'SELECT * FROM accounts WHERE account_number = $1;',
  getAllAccounts: 'SELECT * FROM accounts;',
  deleteSingleAccount: 'DELETE FROM accounts WHERE account_number = $1;',
  updateAccountStatus: 'UPDATE accounts set status = $1 where account_number = $2 returning *;',
  updateAccountBalance: 'UPDATE accounts set balance = $1 where account_number = $2 returning *;',
  getAccountByOwner: 'SELECT * FROM accounts WHERE owner = $1;',
  getAccountByStatus: 'SELECT * FROM accounts WHERE status = $1;',

  // Transactions
  insertTransaction: 'INSERT INTO transactions (type, account_number, cashier_id, amount, old_balance, new_balance) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;',
  getAllTransactions: 'SELECT * FROM transactions WHERE account_number = $1;',
  getSingleTransaction: 'SELECT * FROM transactions WHERE id = $1;',
};
