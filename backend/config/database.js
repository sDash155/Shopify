const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// Database configuration - supports both DATABASE_URL and individual parameters
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if provided (recommended for production)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    // Neon requires SSL, so we enable it for DATABASE_URL connections
    ssl: {
      rejectUnauthorized: false,
      require: true
    },
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };
} else {
  // Use individual parameters (for development)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shopify_analytics',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };
}

const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
