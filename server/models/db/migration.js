import db from './index';
import seeders from './seeders';

const test = async () => {
  const text = `
  DROP TABLE IF EXISTS users CASCADE;
  CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(128) UNIQUE NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    hashed_password VARCHAR (355) NOT NULL,
    type VARCHAR(6) NOT NULL DEFAULT ('client'),
    is_admin BOOLEAN NOT NULL DEFAULT (false),
    created_on TIMESTAMP NOT NULL DEFAULT (NOW())
  );

  DROP TABLE IF EXISTS accounts CASCADE;
  CREATE TABLE accounts(
    id SERIAL NOT NULL PRIMARY KEY,
    account_number BIGINT UNIQUE NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT (NOW()),
    owner BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(7) NOT NULL,
    status VARCHAR(7) NOT NULL DEFAULT ('draft'),
    balance NUMERIC(200, 2) NOT NULL
  );

  DROP TABLE IF EXISTS transactions CASCADE;
  CREATE TABLE transactions(
    id SERIAL NOT NULL PRIMARY KEY,
    created_on TIMESTAMP NOT NULL DEFAULT (NOW()),
    type VARCHAR(6) NOT NULL,
    account_number BIGINT NOT NULL REFERENCES accounts(account_number) ON DELETE CASCADE,
    cashier_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    old_balance NUMERIC(200, 2) NOT NULL,
    new_balance NUMERIC(200, 2) NOT NULL
  );
  `;

  await db.query(text + seeders);
};

test();
