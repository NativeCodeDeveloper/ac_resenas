import pool from './config/db.js';

(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('DB OK:', rows);
    process.exit(0);
  } catch (err) {
    console.error('DB ERROR:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();