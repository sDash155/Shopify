const db = require('../config/database');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database with sample analytics data...');

    // Clear existing data
    await db.query('DELETE FROM sessions_by_device');
    await db.query('DELETE FROM customers_over_time');
    await db.query('DELETE FROM total_sales');
    await db.query('DELETE FROM gross_sales_by_country');
    await db.query('DELETE FROM sales_by_product');
    await db.query('DELETE FROM gross_sales_by_device');
    await db.query('DELETE FROM sessions_by_country');

    // Insert sessions by device data
    await db.query(`
      INSERT INTO sessions_by_device (device_type, session_count, color) VALUES
      ('Mobile', 35, '#00D4AA'),
      ('Desktop', 32, '#5C6AC4'),
      ('Tablet', 26, '#8B5CF6'),
      ('Other', 9, '#E91E63')
    `);

    // Insert customers over time data
    await db.query(`
      INSERT INTO customers_over_time (date, first_time_customers, recurring_customers) VALUES
      ('2023-06-06', 2000, 3000),
      ('2023-06-14', 3500, 4500),
      ('2023-06-22', 5000, 6000),
      ('2023-07-05', 3000, 4000)
    `);

    // Insert total sales data with many more points for smooth curves
    await db.query(`
      INSERT INTO total_sales (date, current_period, previous_period) VALUES
      ('2023-06-06', 6000, 4000),
      ('2023-06-07', 6800, 4100),
      ('2023-06-08', 7500, 4200),
      ('2023-06-09', 8200, 4300),
      ('2023-06-10', 9000, 4500),
      ('2023-06-11', 8500, 4800),
      ('2023-06-12', 4000, 5000),
      ('2023-06-13', 5200, 3500),
      ('2023-06-14', 6500, 2000),
      ('2023-06-15', 7500, 2500),
      ('2023-06-16', 8500, 3500),
      ('2023-06-17', 5500, 3000),
      ('2023-06-18', 2000, 2500),
      ('2023-06-19', 3500, 2200),
      ('2023-06-20', 6000, 2000),
      ('2023-06-21', 7500, 3500),
      ('2023-06-22', 9000, 5000),
      ('2023-06-23', 6000, 3500),
      ('2023-06-24', 3000, 2000),
      ('2023-06-25', 5000, 1800),
      ('2023-06-26', 7000, 2000),
      ('2023-06-27', 8500, 5500),
      ('2023-06-28', 9500, 9000),
      ('2023-06-29', 8700, 9200),
      ('2023-06-30', 8000, 9500),
      ('2023-07-01', 7500, 9400),
      ('2023-07-02', 7000, 9500),
      ('2023-07-03', 6500, 8800),
      ('2023-07-04', 6000, 8500),
      ('2023-07-05', 5500, 8000)
    `);

    // Insert gross sales by country data
    await db.query(`
      INSERT INTO gross_sales_by_country (country, sales_amount) VALUES
      ('United States', 10000),
      ('Canada', 8000),
      ('United Kingdom', 7000),
      ('France', 7500),
      ('Mexico', 6000)
    `);

    // Insert sales by product data
    await db.query(`
      INSERT INTO sales_by_product (product_name, sales_amount, color) VALUES
      ('Wool cap', 419719, '#00D4AA'),
      ('Crewneck', 251831, '#8B5CF6'),
      ('Blouse', 167887, '#5C6AC4'),
      ('T-shirt', 75549, '#E91E63'),
      ('Long sleeve', 75549, '#10B981')
    `);

         // Insert gross sales by device data with sinusoidal wave patterns
     await db.query(`
       INSERT INTO gross_sales_by_device (date, mobile_sales, desktop_sales, tablet_sales) VALUES
       ('2023-06-06', 9000, 7000, 5000),
       ('2023-06-07', 9500, 7500, 5200),
       ('2023-06-08', 8700, 7800, 4800),
       ('2023-06-09', 9400, 7200, 4600),
       ('2023-06-10', 8800, 7600, 5300),
       ('2023-06-11', 9200, 8100, 4900),
       ('2023-06-12', 8600, 7400, 5100),
       ('2023-06-13', 9700, 7900, 4700),
       ('2023-06-14', 8900, 7300, 5500),
       ('2023-06-15', 9300, 7700, 5000),
       ('2023-06-16', 8700, 8200, 4800),
       ('2023-06-17', 9600, 7500, 5200),
       ('2023-06-18', 8800, 7800, 5400),
       ('2023-06-19', 9400, 7200, 4900),
       ('2023-06-20', 8600, 7600, 5300),
       ('2023-06-21', 9200, 8100, 5100),
       ('2023-06-22', 8900, 7400, 4700),
       ('2023-06-23', 9500, 7700, 5200),
       ('2023-06-24', 8700, 8200, 5000),
       ('2023-06-25', 9300, 7600, 4800),
       ('2023-06-26', 8600, 7900, 5400),
       ('2023-06-27', 9400, 7300, 5000),
       ('2023-06-28', 8800, 7700, 5200),
       ('2023-06-29', 9700, 8100, 4900),
       ('2023-06-30', 8900, 7400, 5300),
       ('2023-07-01', 9300, 7800, 4700),
       ('2023-07-02', 8600, 8200, 5100),
       ('2023-07-03', 9500, 7600, 4900),
       ('2023-07-04', 8800, 8000, 5400),
       ('2023-07-05', 9200, 7300, 5000)
     `);

    // Insert sessions by country data
    await db.query(`
      INSERT INTO sessions_by_country (date, us_sessions, ca_sessions, uk_sessions, fr_sessions) VALUES
      ('2023-06-06', 3000, 2000, 1500, 1000),
      ('2023-06-14', 3500, 1500, 1500, 2500),
      ('2023-06-22', 3000, 1500, 500, 1000),
      ('2023-07-05', 3500, 2000, 2000, 2000)
    `);

    // Insert sessions over time data
    await db.query(`
      INSERT INTO sessions_over_time (date, current_period, previous_period) VALUES
      ('2023-06-06', 9000, 6000),
      ('2023-06-14', 5500, 7500),
      ('2023-06-22', 7000, 4500),
      ('2023-07-05', 6000, 8000)
    `);

    // Seed customer satisfaction data
    await db.query(`
      INSERT INTO customer_satisfaction (rating, status, total_reviews, monthly_growth, satisfied_percentage, neutral_percentage, dissatisfied_percentage)
      VALUES (4.8, 'Excellent Rating', 2847, 12.00, 85, 10, 5)
      ON CONFLICT DO NOTHING
    `);

    // Seed conversion rate data
    await db.query(`
      INSERT INTO conversion_rate (conversion_rate, monthly_growth, target_rate, progress_percentage)
      VALUES (3.20, 0.80, 4.00, 80)
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data includes:');
    console.log('   - Sessions by device (4 records)');
    console.log('   - Customers over time (4 records)');
    console.log('   - Total sales (15 records)');
    console.log('   - Gross sales by country (5 records)');
    console.log('   - Sales by product (5 records)');
    console.log('   - Gross sales by device (30 records)');
    console.log('   - Sessions by country (4 records)');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
};

seedData();
