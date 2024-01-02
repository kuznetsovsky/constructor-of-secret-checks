import 'dotenv/config'

// ENV
export const ENV = process.env.NODE_ENV ?? 'production'
export const IS_DEV = ENV === 'development'

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
