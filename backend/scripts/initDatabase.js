const db = require('../config/database');

const createTables = async () => {
  try {
    console.log('🗄️  Creating database tables...');

    // Sessions by device table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions_by_device (
        id SERIAL PRIMARY KEY,
        device_type VARCHAR(50) NOT NULL,
        session_count INTEGER NOT NULL,
        color VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customers over time table
    await db.query(`
      CREATE TABLE IF NOT EXISTS customers_over_time (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        first_time_customers INTEGER NOT NULL,
        recurring_customers INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Total sales table
    await db.query(`
      CREATE TABLE IF NOT EXISTS total_sales (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        current_period INTEGER NOT NULL,
        previous_period INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Gross sales by country table
    await db.query(`
      CREATE TABLE IF NOT EXISTS gross_sales_by_country (
        id SERIAL PRIMARY KEY,
        country VARCHAR(100) NOT NULL,
        sales_amount INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sales by product table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sales_by_product (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        sales_amount INTEGER NOT NULL,
        color VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Gross sales by device table
    await db.query(`
      CREATE TABLE IF NOT EXISTS gross_sales_by_device (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        mobile_sales INTEGER NOT NULL,
        desktop_sales INTEGER NOT NULL,
        tablet_sales INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sessions by country table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions_by_country (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        us_sessions INTEGER NOT NULL,
        ca_sessions INTEGER NOT NULL,
        uk_sessions INTEGER NOT NULL,
        fr_sessions INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sessions over time table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions_over_time (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        current_period INTEGER NOT NULL,
        previous_period INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create customer_satisfaction table
    await db.query(`
      CREATE TABLE IF NOT EXISTS customer_satisfaction (
        id SERIAL PRIMARY KEY,
        rating DECIMAL(3,1) NOT NULL,
        status VARCHAR(50) NOT NULL,
        total_reviews INTEGER NOT NULL,
        monthly_growth DECIMAL(5,2) NOT NULL,
        satisfied_percentage INTEGER NOT NULL,
        neutral_percentage INTEGER NOT NULL,
        dissatisfied_percentage INTEGER NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create conversion_rate table
    await db.query(`
      CREATE TABLE IF NOT EXISTS conversion_rate (
        id SERIAL PRIMARY KEY,
        conversion_rate DECIMAL(4,2) NOT NULL,
        monthly_growth DECIMAL(4,2) NOT NULL,
        target_rate DECIMAL(4,2) NOT NULL,
        progress_percentage INTEGER NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created successfully!');
    
    // Check if data exists
    const sessionsCheck = await db.query('SELECT COUNT(*) FROM sessions_by_device');
    if (parseInt(sessionsCheck.rows[0].count) === 0) {
      console.log('📊 No data found. Run "npm run seed-data" to populate with sample data.');
    } else {
      console.log('📊 Database already contains data.');
    }

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
};

createTables();
