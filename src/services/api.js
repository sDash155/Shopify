const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://shopify-eqge.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all dashboard data
  async getDashboardData() {
    return this.request('/api/analytics/dashboard');
  }

  // Get sessions by device
  async getSessionsByDevice() {
    return this.request('/api/analytics/sessions-by-device');
  }

  // Get customers over time
  async getCustomersOverTime() {
    return this.request('/api/analytics/customers-over-time');
  }

  // Get total sales
  async getTotalSales() {
    return this.request('/api/analytics/total-sales');
  }

  // Get gross sales by country
  async getGrossSalesByCountry() {
    return this.request('/api/analytics/gross-sales-by-country');
  }

  // Get sales by product
  async getSalesByProduct() {
    return this.request('/api/analytics/sales-by-product');
  }

  // Get gross sales by device
  async getGrossSalesByDevice() {
    return this.request('/api/analytics/gross-sales-by-device');
  }

  // Get sessions by country
  async getSessionsByCountry() {
    return this.request('/api/analytics/sessions-by-country');
  }

  // Get customer satisfaction
  async getCustomerSatisfaction() {
    return this.request('/api/analytics/customer-satisfaction');
  }

  // Get conversion rate
  async getConversionRate() {
    return this.request('/api/analytics/conversion-rate');
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

export default new ApiService();
