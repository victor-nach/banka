import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
// Process.env.database_url takes different values values depending on the platform it is being run
// it is local postgres on local, elephantdb on travis and heroku postgres on heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default {
  // query: (text, params) => new Promise((resolve, reject) => {
  //   pool.query(text, params)
  //     .then((res) => {
  //       resolve(res);
  //       pool.end();
  //     })
  //     .catch((err) => {
  //       reject(err);
  //       pool.end();
  //     });
  // }),
  query: (text, params) => pool.query(text, params),
};
