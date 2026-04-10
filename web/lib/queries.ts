import { getDb } from "./db";
import type { KeyCount, ComboCount, DailyTotal } from "./types";

export function getDailyTotal(date: string): number {
  const db = getDb();
  const row = db
    .prepare("SELECT COUNT(*) as count FROM key_events WHERE date = ?")
    .get(date) as { count: number } | undefined;
  return row?.count ?? 0;
}

export function getUniqueKeysCount(date: string): number {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT COUNT(DISTINCT key_name) as count FROM key_events WHERE date = ?"
    )
    .get(date) as { count: number } | undefined;
  return row?.count ?? 0;
}

export function getTopCombo(
  date: string
): { combo: string; count: number } | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT combo, COUNT(*) as count FROM key_events
       WHERE date = ? AND combo IS NOT NULL
       GROUP BY combo ORDER BY count DESC LIMIT 1`
    )
    .get(date) as { combo: string; count: number } | undefined;
  return row ?? null;
}

export function getKeyCounts(date: string, search?: string): KeyCount[] {
  const db = getDb();
  let sql = `SELECT key_name as keyName, COUNT(*) as count FROM key_events WHERE date = ?`;
  const params: string[] = [date];

  if (search) {
    sql += ` AND key_name LIKE ?`;
    params.push(`%${search}%`);
  }

  sql += ` GROUP BY key_name ORDER BY count DESC`;

  return db.prepare(sql).all(...params) as KeyCount[];
}

export function getComboCounts(date: string, search?: string): ComboCount[] {
  const db = getDb();
  let sql = `SELECT combo, COUNT(*) as count FROM key_events WHERE date = ? AND combo IS NOT NULL`;
  const params: string[] = [date];

  if (search) {
    sql += ` AND combo LIKE ?`;
    params.push(`%${search}%`);
  }

  sql += ` GROUP BY combo ORDER BY count DESC`;

  return db.prepare(sql).all(...params) as ComboCount[];
}

export function getDailyTotals(from: string, to: string): DailyTotal[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT date, COUNT(*) as count FROM key_events
       WHERE date >= ? AND date <= ?
       GROUP BY date ORDER BY date`
    )
    .all(from, to) as DailyTotal[];
}

export function isDaemonActive(): boolean {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COUNT(*) as count FROM key_events
       WHERE timestamp > ?`
    )
    .get(Date.now() - 60000) as { count: number } | undefined;
  return (row?.count ?? 0) > 0;
}
