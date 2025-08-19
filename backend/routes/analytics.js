const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all analytics data
router.get('/dashboard', async (req, res) => {
  try {
    const [
      sessionsByDevice,
      customersOverTime,
      totalSales,
      grossSalesByCountry,
      salesByProduct,
      grossSalesByDevice,
      sessionsByCountry,
      customerSatisfaction,
      conversionRate,
      sessionsOverTime
    ] = await Promise.all([
      getSessionsByDevice(),
      getCustomersOverTime(),
      getTotalSales(),
      getGrossSalesByCountry(),
      getSalesByProduct(),
      getGrossSalesByDevice(),
      getSessionsByCountry(),
      getCustomerSatisfaction(),
      getConversionRate(),
      getSessionsOverTime()
    ]);

    res.json({
      sessionsByDevice,
      customersOverTime,
      totalSales,
      grossSalesByCountry,
      salesByProduct,
      grossSalesByDevice,
      sessionsByCountry,
      customerSatisfaction,
      conversionRate,
      sessionsOverTime
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get sessions by device
router.get('/sessions-by-device', async (req, res) => {
  try {
    const data = await getSessionsByDevice();
    res.json(data);
  } catch (error) {
    console.error('Error fetching sessions by device:', error);
    res.status(500).json({ error: 'Failed to fetch sessions by device data' });
  }
});

// Get customers over time
router.get('/customers-over-time', async (req, res) => {
  try {
    const data = await getCustomersOverTime();
    res.json(data);
  } catch (error) {
    console.error('Error fetching customers over time:', error);
    res.status(500).json({ error: 'Failed to fetch customers over time data' });
  }
});

// Get total sales
router.get('/total-sales', async (req, res) => {
  try {
    const data = await getTotalSales();
    res.json(data);
  } catch (error) {
    console.error('Error fetching total sales:', error);
    res.status(500).json({ error: 'Failed to fetch total sales data' });
  }
});

// Get gross sales by country
router.get('/gross-sales-by-country', async (req, res) => {
  try {
    const data = await getGrossSalesByCountry();
    res.json(data);
  } catch (error) {
    console.error('Error fetching gross sales by country:', error);
    res.status(500).json({ error: 'Failed to fetch gross sales by country data' });
  }
});

// Get sales by product
router.get('/sales-by-product', async (req, res) => {
  try {
    const data = await getSalesByProduct();
    res.json(data);
  } catch (error) {
    console.error('Error fetching sales by product:', error);
    res.status(500).json({ error: 'Failed to fetch sales by product data' });
  }
});

// Get gross sales by device
router.get('/gross-sales-by-device', async (req, res) => {
  try {
    const data = await getGrossSalesByDevice();
    res.json(data);
  } catch (error) {
    console.error('Error fetching gross sales by device:', error);
    res.status(500).json({ error: 'Failed to fetch gross sales by device data' });
  }
});

// Get sessions by country
router.get('/sessions-by-country', async (req, res) => {
  try {
    const data = await getSessionsByCountry();
    res.json(data);
  } catch (error) {
    console.error('Error fetching sessions by country:', error);
    res.status(500).json({ error: 'Failed to fetch sessions by country data' });
  }
});

// Get customer satisfaction data
router.get('/customer-satisfaction', async (req, res) => {
  try {
    const data = await getCustomerSatisfaction();
    res.json(data);
  } catch (error) {
    console.error('Error fetching customer satisfaction:', error);
    res.status(500).json({ error: 'Failed to fetch customer satisfaction data' });
  }
});

// Get conversion rate data
router.get('/conversion-rate', async (req, res) => {
  try {
    const data = await getConversionRate();
    res.json(data);
  } catch (error) {
    console.error('Error fetching conversion rate:', error);
    res.status(500).json({ error: 'Failed to fetch conversion rate data' });
  }
});

// Database query functions
async function getSessionsByDevice() {
  const query = `
    SELECT device_type as name, session_count as value, color
    FROM sessions_by_device
    ORDER BY session_count DESC
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getCustomersOverTime() {
  const query = `
    SELECT date, first_time_customers as "firstTime", recurring_customers as "recurring"
    FROM customers_over_time
    ORDER BY date
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getTotalSales() {
  const query = `
    SELECT date, current_period as current, previous_period as previous
    FROM total_sales
    ORDER BY date
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getGrossSalesByCountry() {
  const query = `
    SELECT country, sales_amount as sales
    FROM gross_sales_by_country
    ORDER BY sales_amount DESC
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getSalesByProduct() {
  const query = `
    SELECT product_name as product, sales_amount as sales, color
    FROM sales_by_product
    ORDER BY sales_amount DESC
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getGrossSalesByDevice() {
  const query = `
    SELECT date, mobile_sales as mobile, desktop_sales as desktop, tablet_sales as tablet
    FROM gross_sales_by_device
    ORDER BY date
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getSessionsByCountry() {
  const query = `
    SELECT date, us_sessions as us, ca_sessions as ca, uk_sessions as uk, fr_sessions as fr
    FROM sessions_by_country
    ORDER BY date
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getCustomerSatisfaction() {
  const query = `
    SELECT 
      rating,
      status,
      total_reviews as reviews,
      monthly_growth as "monthlyGrowth",
      satisfied_percentage as "satisfied",
      neutral_percentage as "neutral",
      dissatisfied_percentage as "dissatisfied",
      last_updated as "lastUpdated"
    FROM customer_satisfaction
    ORDER BY last_updated DESC
    LIMIT 1
  `;
  const result = await db.query(query);
  return result.rows[0] || {
    rating: 4.8,
    status: "Excellent Rating",
    reviews: 2847,
    monthlyGrowth: 12,
    satisfied: 85,
    neutral: 10,
    dissatisfied: 5,
    lastUpdated: "2 hours ago"
  };
}

async function getSessionsOverTime() {
  const query = `
    SELECT 
      date,
      current_period as current,
      previous_period as previous
    FROM sessions_over_time
    ORDER BY date
  `;
  const result = await db.query(query);
  return result.rows;
}

async function getConversionRate() {
  const query = `
    SELECT 
      conversion_rate as rate,
      monthly_growth as growth,
      target_rate as target,
      progress_percentage as progress
    FROM conversion_rate
    ORDER BY last_updated DESC
    LIMIT 1
  `;
  const result = await db.query(query);
  return result.rows[0] || {
    rate: 3.2,
    growth: 0.8,
    target: 4.0,
    progress: 80
  };
}

module.exports = router;
