import 'dotenv/config'

// ENV
export const ENV = process.env.NODE_ENV ?? 'production'
export const IS_DEV = ENV === 'development'
export const IS_TEST = ENV === 'test'

if (process.env.DB_CONNECTION === undefined && (ENV === 'production' || ENV === 'development')) {
  throw new Error('DB_CONNECTION environment variable is missing')
}

if (process.env.DB_CONNECTION_TEST === undefined && ENV === 'test') {
  throw new Error('DB_CONNECTION_TEST environment variable is missing')
}

// Server
export const HOST = process.env.HOST ?? 'localhost'
export const PORT = process.env.PORT ?? 8000

// App
export const VERSION = '/api/v1'

// Database
export const DATABASE_CONNECTION = process.env.DB_CONNECTION
export const DATABASE_CONNECTION_TEST = process.env.DB_CONNECTION_TEST

// Session
export const SESSION_SECRET = process.env.SESSION_SECRET ?? 'SECRET_KEY'
export const SESSION_MAX_AGE = 6.048e+8 // 7 days

// Pagination
export const MAX_PER_PAGE = 100
export const DEFAULT_PER_PAGE = '30'
export const DEFAULT_PAGE = '1'
export const DEFAULT_DIRECTION = 'desc'
export const DEFAULT_SORT = 'id'

// Redis
export const REDIS_URL = process.env.REDIS_URL ?? ''

// Mailer (for production)
export const MAILER_HOST = process.env.MAILER_HOST
export const MAILER_PORT = parseInt(process.env.MAILER_PORT as unknown as string)
export const MAILER_SECURE = Boolean(process.env.MAILER_SECURE)
export const MAILER_USER = process.env.MAILER_USER
export const MAILER_PASS = process.env.MAILER_PASS

// Feedback
export const NO_REPLAY_EMAIL = 'no-replay@mail.com'
export const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL ?? ''

// Expires
export const EXPIRES_IN_FIFTEEN_MINUTES = 60 * 15
export const EXPIRES_IN_HOUR = 60 * 60

// Files
export const PATH_TO_LOGOS = '/public/uploads/logos'
