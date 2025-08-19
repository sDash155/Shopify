const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    return this.request('/analytics/dashboard');
  }

  // Get sessions by device
  async getSessionsByDevice() {
    return this.request('/analytics/sessions-by-device');
  }

  // Get customers over time
  async getCustomersOverTime() {
    return this.request('/analytics/customers-over-time');
  }

  // Get total sales
  async getTotalSales() {
    return this.request('/analytics/total-sales');
  }

  // Get gross sales by country
  async getGrossSalesByCountry() {
    return this.request('/analytics/gross-sales-by-country');
  }

  // Get sales by product
  async getSalesByProduct() {
    return this.request('/analytics/sales-by-product');
  }

  // Get gross sales by device
  async getGrossSalesByDevice() {
    return this.request('/analytics/gross-sales-by-device');
  }

  // Get sessions by country
  async getSessionsByCountry() {
    return this.request('/analytics/sessions-by-country');
  }

  // Get customer satisfaction
  async getCustomerSatisfaction() {
    return this.request('/analytics/customer-satisfaction');
  }

  // Get conversion rate
  async getConversionRate() {
    return this.request('/analytics/conversion-rate');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
