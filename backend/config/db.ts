import sqlite3 from 'sqlite3';
import path from 'path';

// Resolve the path to the database file in the same folder as `server.ts`
export const db = new sqlite3.Database(path.resolve(__dirname, './db.db'), (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  }
  console.log('Connected to the database.');

  // get users
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error getting users:', err.message);
    } else {
      console.log('Users:', rows);
    }
  });
});
