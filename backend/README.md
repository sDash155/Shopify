# Shopify Analytics Backend

A Node.js/Express backend with PostgreSQL database for the Shopify Analytics Clone.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup
1. Create a PostgreSQL database named `shopify_analytics`
2. Update the database credentials in `config.env` if needed
3. Initialize the database tables:
```bash
npm run init-db
```

### 3. Seed Sample Data
```bash
npm run seed-data
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📊 API Endpoints

### Dashboard Data
- `GET /api/analytics/dashboard` - Get all analytics data

### Individual Endpoints
- `GET /api/analytics/sessions-by-device` - Sessions by device data
- `GET /api/analytics/customers-over-time` - Customers over time data
- `GET /api/analytics/total-sales` - Total sales data
- `GET /api/analytics/gross-sales-by-country` - Gross sales by country
- `GET /api/analytics/sales-by-product` - Sales by product data
- `GET /api/analytics/gross-sales-by-device` - Gross sales by device
- `GET /api/analytics/sessions-by-country` - Sessions by country data

### Health Check
- `GET /health` - Server health status

## 🗄️ Database Schema

### Tables Created:
1. `sessions_by_device` - Device type analytics
2. `customers_over_time` - Customer growth over time
3. `total_sales` - Sales performance data
4. `gross_sales_by_country` - Geographic sales data
5. `sales_by_product` - Product performance
6. `gross_sales_by_device` - Device-based sales
7. `sessions_by_country` - Geographic session data

## 🔧 Configuration

Update `config.env` with your database credentials. You have two options:

**Option 1: Using DATABASE_URL (Recommended for production)**
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/shopify_analytics
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Option 2: Using Individual Parameters (For development)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_analytics
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**DATABASE_URL Format:** `postgresql://username:password@host:port/database_name`

**Benefits of DATABASE_URL:**
- Cleaner configuration
- Standard format used by cloud providers (Heroku, Railway, etc.)
- Easier to manage in production environments
- Supports SSL configuration automatically

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Create database tables
- `npm run seed-data` - Populate with sample data

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation
- Error handling middleware
- SQL injection protection (using parameterized queries)

## 🧪 Testing the API

You can test the endpoints using curl or Postman:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Get all dashboard data
curl http://localhost:5000/api/analytics/dashboard

# Get specific data
curl http://localhost:5000/api/analytics/sessions-by-device
```
