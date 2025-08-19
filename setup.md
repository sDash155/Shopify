# 🚀 Shopify Analytics Clone - Full Stack Setup Guide

This guide will help you set up the complete Shopify Analytics Clone with React frontend and Node.js/PostgreSQL backend.

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Git**

## 🗄️ Database Setup

### 1. Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE shopify_analytics;

# Verify database creation
\l

# Exit PostgreSQL
\q
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Update `config.env` with your database credentials. You have two options:

**Option 1: Using DATABASE_URL (Recommended)**
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/shopify_analytics
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Option 2: Using Individual Parameters**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopify_analytics
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Note:** The DATABASE_URL format is: `postgresql://username:password@host:port/database_name`

### 4. Initialize Database
```bash
npm run init-db
```

### 5. Seed Sample Data
```bash
npm run seed-data
```

### 6. Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will be running on `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Navigate to Project Root
```bash
cd ..
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "OK",
  "message": "Shopify Analytics Backend is running",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

### 2. Test Analytics API
```bash
curl http://localhost:5000/api/analytics/dashboard
```
Expected response: JSON with all analytics data

### 3. Test Frontend
Open `http://localhost:3000` in your browser. You should see:
- Loading spinner initially
- Analytics dashboard with live data from PostgreSQL
- Infinite scrolling carousel with real data

## 📊 Available Data

The seeded database contains:

- **Sessions by Device**: 4 records (Mobile, Desktop, Tablet, Other)
- **Customers Over Time**: 4 records (Jun 6 - Jul 5, 2023)
- **Total Sales**: 15 records (Jun 6 - Jul 5, 2023)
- **Gross Sales by Country**: 5 records (US, Canada, UK, France, Mexico)
- **Sales by Product**: 5 records (Wool cap, Crewneck, Blouse, T-shirt, Long sleeve)
- **Gross Sales by Device**: 4 records (Mobile, Desktop, Tablet sales over time)
- **Sessions by Country**: 4 records (US, Canada, UK, France sessions over time)

## 🔍 API Endpoints

### Dashboard Data
- `GET /api/analytics/dashboard` - All analytics data

### Individual Endpoints
- `GET /api/analytics/sessions-by-device`
- `GET /api/analytics/customers-over-time`
- `GET /api/analytics/total-sales`
- `GET /api/analytics/gross-sales-by-country`
- `GET /api/analytics/sales-by-product`
- `GET /api/analytics/gross-sales-by-device`
- `GET /api/analytics/sessions-by-country`

## 🛠️ Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check database credentials in `config.env`
3. Ensure database `shopify_analytics` exists
4. Test connection: `psql -U postgres -d shopify_analytics`

### Backend Issues
1. Check if port 5000 is available
2. Verify all dependencies are installed
3. Check console for error messages
4. Ensure database tables are created

### Frontend Issues
1. Check if backend is running on port 5000
2. Verify CORS settings
3. Check browser console for errors
4. Ensure all dependencies are installed

### Common Commands
```bash
# Reset database
npm run init-db
npm run seed-data

# Restart backend
npm run dev

# Restart frontend
npm start

# Check database connection
psql -U postgres -d shopify_analytics -c "SELECT COUNT(*) FROM sessions_by_device;"
```

## 🎯 Next Steps

1. **Customize Data**: Modify `backend/scripts/seedData.js` to add your own data
2. **Add Real-time Updates**: Implement WebSocket connections for live data
3. **Add Authentication**: Implement user login and data filtering
4. **Add More Charts**: Create additional analytics visualizations
5. **Deploy**: Deploy to cloud platforms (Heroku, AWS, etc.)

## 📝 Notes

- The frontend uses React with Recharts for data visualization
- The backend uses Express.js with PostgreSQL
- All data is fetched from the database via REST API
- The carousel effect is purely frontend CSS/JS
- Data is static but can be easily modified in the database

Happy coding! 🚀
