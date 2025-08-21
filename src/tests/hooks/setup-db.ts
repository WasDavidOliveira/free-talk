import { db } from '@/db/db.connection';
import { afterAll, afterEach, beforeEach } from 'vitest';

const pool = (db as { _client?: { end: () => Promise<void> } })._client;

export function setupTestDB() {
  beforeEach(async () => {
    await db.execute('BEGIN');
  });

  afterEach(async () => {
    await db.execute('ROLLBACK');
  });

  afterAll(async () => {
    if (pool && typeof pool.end === 'function') {
      await pool.end();
    }
  });
}

export default setupTestDB;
