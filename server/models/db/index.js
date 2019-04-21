import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
let connectionString;
if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_URL;
}
if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.TESTDB_URL || process.env.LOCALDB_URL;
}
const pool = new Pool({
  connectionString,
});

export default {
  query: (text, params) => new Promise((resolve, reject) => {
    pool.query(text, params)
      .then((res) => {
        resolve(res);
        pool.end();
      })
      .catch((err) => {
        reject(err);
        pool.end();
      });
  }),
  // query: (text, params) => pool.query(text, params),
};
