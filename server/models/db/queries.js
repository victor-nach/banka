export default {
  insertUser: `INSERT INTO users(email, first_name, last_name, hashed_password)
                           VALUES($1, $2, $3, $4) RETURNING *`,
  getSingleUser: 'SELECT * FROM users WHERE email = $1',
};
