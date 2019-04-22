export default {
  // Users
  insertUser: 'INSERT INTO users(email, first_name, last_name, hashed_password) VALUES($1, $2, $3, $4) RETURNING *',
  getSingleUser: 'SELECT * FROM users WHERE email = $1',
  getUserById: 'SELECT * FROM users WHERE id = $1',

  // Accounts
  insertAccount: 'INSERT INTO accounts (account_number, owner, type, status, balance) VALUES($1, $2, $3, $4, $5) RETURNING *',
  getSingleAccount: 'SELECT * FROM accounts WHERE account_number = $1',
  getAllAccounts: 'SELECT * FROM accounts',
  deleteSingleAccount: 'DELETE FROM accounts WHERE account_number = $1',
};
