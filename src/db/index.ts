import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../schema';

const sqlite = new Database('./visitors.db');
export const db = drizzle(sqlite, { schema });

// Initialize database tables
export function initializeDatabase() {
  // Create visitors table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      id TEXT PRIMARY KEY,
      visitor_id TEXT NOT NULL UNIQUE,
      is_new_visitor INTEGER NOT NULL DEFAULT 1,
      first_visit_at TEXT NOT NULL,
      last_visit_at TEXT NOT NULL,
      total_visits INTEGER NOT NULL DEFAULT 1,
      user_agent TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_visitors_last_visit_at ON visitors(last_visit_at);
    CREATE INDEX IF NOT EXISTS idx_visitors_is_new_visitor ON visitors(is_new_visitor);
  `);

  // Create blog_views table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS blog_views (
      id TEXT PRIMARY KEY,
      visitor_id TEXT NOT NULL,
      blog_slug TEXT NOT NULL,
      blog_title TEXT NOT NULL,
      view_count INTEGER NOT NULL DEFAULT 1,
      first_viewed_at TEXT NOT NULL,
      last_viewed_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_blog_views_visitor_id ON blog_views(visitor_id);
    CREATE INDEX IF NOT EXISTS idx_blog_views_blog_slug ON blog_views(blog_slug);
    CREATE INDEX IF NOT EXISTS idx_blog_views_last_viewed_at ON blog_views(last_viewed_at);
    CREATE INDEX IF NOT EXISTS idx_blog_views_visitor_blog ON blog_views(visitor_id, blog_slug);
  `);
}
