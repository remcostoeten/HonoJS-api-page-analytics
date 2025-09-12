import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const visitors = sqliteTable('visitors', {
  id: text('id').primaryKey(),
  visitorId: text('visitor_id').notNull().unique(),
  isNewVisitor: integer('is_new_visitor', { mode: 'boolean' }).notNull().default(true),
  firstVisitAt: text('first_visit_at').notNull(),
  lastVisitAt: text('last_visit_at').notNull(),
  totalVisits: integer('total_visits').notNull().default(1),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const blogViews = sqliteTable('blog_views', {
  id: text('id').primaryKey(),
  visitorId: text('visitor_id').notNull(),
  blogSlug: text('blog_slug').notNull(),
  blogTitle: text('blog_title').notNull(),
  viewCount: integer('view_count').notNull().default(1),
  firstViewedAt: text('first_viewed_at').notNull(),
  lastViewedAt: text('last_viewed_at').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Indexes for better performance
export const visitorsIndexes = {
  visitorId: 'idx_visitors_visitor_id',
  lastVisitAt: 'idx_visitors_last_visit_at',
  isNewVisitor: 'idx_visitors_is_new_visitor',
};

export const blogViewsIndexes = {
  visitorId: 'idx_blog_views_visitor_id',
  blogSlug: 'idx_blog_views_blog_slug',
  lastViewedAt: 'idx_blog_views_last_viewed_at',
  visitorBlog: 'idx_blog_views_visitor_blog', // Composite index for visitor + blog
};
