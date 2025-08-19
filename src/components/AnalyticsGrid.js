import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { MdManageSearch } from 'react-icons/md';
import apiService from '../services/api';

const AnalyticsGrid = React.memo(() => {
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for API data
  const [sessionsByDevice, setSessionsByDevice] = useState([]);
  const [customersOverTime, setCustomersOverTime] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [grossSalesByCountry, setGrossSalesByCountry] = useState([]);
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [grossSalesByDevice, setGrossSalesByDevice] = useState([]);
  const [sessionsByCountry, setSessionsByCountry] = useState([]);
  
  // State for new dynamic cards
  const [customerSatisfaction, setCustomerSatisfaction] = useState({});
  const [conversionRate, setConversionRate] = useState({});
  const [sessionsOverTime, setSessionsOverTime] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardData();
        
        setSessionsByDevice(data.sessionsByDevice);
        setCustomersOverTime(data.customersOverTime);
        setTotalSales(data.totalSales);
        setGrossSalesByCountry(data.grossSalesByCountry);
        setSalesByProduct(data.salesByProduct);
        setGrossSalesByDevice(data.grossSalesByDevice);
        setSessionsByCountry(data.sessionsByCountry);
        setCustomerSatisfaction(data.customerSatisfaction);
        setConversionRate(data.conversionRate);
        setSessionsOverTime(data.sessionsOverTime);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this only runs once on mount

  // Memoize hover handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }, []);

  const ChartCard = useCallback(({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow duration-200 flex-shrink-0 ${className}`} style={{ height: 'fit-content' }}>
      <div className="flex justify-between items-start mb-2">
        <div>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <div className="border-b-2 border-dotted border-gray-380 mt-1 w-full"></div>
        </div>
        <button className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200">
          <MdManageSearch className="w-3 h-3 text-gray-500" />
        </button>
      </div>
      {children}
    </div>
  ), []);

  // Create the chart cards array for carousel - memoized to prevent re-renders
  const chartCards = useMemo(() => [
    // Gross sales by country
    <ChartCard key="gross-sales-country" title="Gross sales by country" className="min-w-[380px]">
              <div className="space-y-4 mt-2">
                {grossSalesByCountry.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-24">{item.country}</span>
                    <div className="flex items-center flex-1 ml-4">
                      <div 
                        className="h-2 bg-blue-500 rounded mr-3"
                        style={{ width: `${(item.sales / 10000) * 190}px` }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">₹{item.sales/1000}K</span>
                    </div>
                  </div>
                ))}
              </div>
    </ChartCard>,

    // Sessions over time
    <ChartCard key="sessions-over-time" title="Sessions over time" className="min-w-[400px]">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sessionsOverTime} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              const month = date.toLocaleDateString('en-US', { month: 'short' });
              const day = date.getDate();
              return `${month} ${day}`;
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            ticks={[0, 5000, 10000]}
            tickFormatter={(value) => `${value/1000}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="current" fill="#0EA5E9" />
          <Bar dataKey="previous" fill="#BAE6FD" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
          <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-sky-200 rounded mr-1"></div>
          <span className="text-gray-600">Apr 22–Apr 28, 2024</span>
        </div>
      </div>
    </ChartCard>,

    // Sessions by device
    <ChartCard key="sessions-device" title="Sessions by device" className="min-w-[500px]">
      <div className="flex items-center h-48">
                <div className="w-48">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sessionsByDevice}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sessionsByDevice.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold text-gray-900">
                        10K
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-6 flex-1 min-w-0 pr-4">
                  <div className="space-y-3">
                    {sessionsByDevice.map((item, index) => (
                      <div key={index} className="flex items-center justify-between w-full">
                        <div className="flex items-center min-w-0 flex-1">
                          <div 
                            className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-xs text-gray-700 truncate">{item.name}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900" style={{ marginLeft: '120px' }}>{item.value},000</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-gray-500 ml-6">+1 more</span>
                    </div>
                  </div>
                </div>
              </div>
    </ChartCard>,

    // Customers over time
    <ChartCard key="customers-time" title="Customers over time" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={customersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="firstTime" 
                    stackId="1"
                    stroke="#0EA5E9" 
                    fill="#0EA5E9" 
                    fillOpacity={0.35} 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recurring" 
                    stackId="1"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.25} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">First time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span className="text-gray-600">Recurring</span>
                </div>
              </div>
    </ChartCard>,

    // Total sales
    <ChartCard key="total-sales" title="Total sales" className="w-80">
      {console.log('Total Sales Data:', totalSales)}
      <div className="text-xs text-gray-500 mb-2">₹20K</div>
      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={totalSales}>
          <defs>
            <linearGradient id="blueGlassGradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.15} />
            </linearGradient>
          </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
            interval="preserveStartEnd"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="current" 
            stroke="none"
            fill="#0EA5E9"
            fillOpacity={0.4}
          />
          <Area 
            type="monotone" 
            dataKey="current" 
            stroke="none"
            fill="#0EA5E9"
            fillOpacity={0.2}
          />
          <Area 
            type="monotone" 
            dataKey="current" 
            stroke="none"
            fill="#0EA5E9"
            fillOpacity={0.1}
          />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#0EA5E9" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="previous" 
            stroke="#94A3B8" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
          <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded mr-1"></div>
          <span className="text-gray-600">May 7–Jun 5, 2023</span>
                </div>
              </div>
    </ChartCard>,

    // Sales by product name
    <ChartCard key="sales-product" title="Sales by product name" className="min-w-[450px]">
              <div className="space-y-3 mb-4">
                {salesByProduct.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded mr-3" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-700">{item.product}</span>
                    </div>
                    <span className="font-medium text-gray-900">₹{item.sales.toLocaleString()}</span>
                  </div>
                ))}
                <div className="text-sm text-gray-500 ml-6">+3 more</div>
              </div>
              <div className="mt-4">
        <div className="flex h-8 rounded overflow-hidden">
                  {salesByProduct.map((item, index) => (
                    <div 
                      key={index}
                      className="h-full"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.sales / 419719) * 100}%`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
    </ChartCard>,

    // Gross sales by device
    <ChartCard key="gross-sales-device" title="Gross sales by device" className="w-80">
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={grossSalesByDevice}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="mobile" 
            stroke="none"
            fill="#0EA5E9"
            fillOpacity={0.3}
          />
          <Area 
            type="monotone" 
            dataKey="desktop" 
            stroke="none"
            fill="#8B5CF6"
            fillOpacity={0.25}
          />
          <Area 
            type="monotone" 
            dataKey="tablet" 
            stroke="none"
            fill="#1E40AF"
            fillOpacity={0.2}
          />
          <Line 
            type="monotone" 
            dataKey="mobile" 
            stroke="#0EA5E9" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="desktop" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="tablet" 
            stroke="#1E40AF" 
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-blue-400 mr-1"></div>
          <span className="text-gray-600">Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-purple-500 mr-1"></div>
          <span className="text-gray-600">Desktop</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-blue-800 mr-1"></div>
          <span className="text-gray-600">Tablet</span>
                </div>
                </div>
    </ChartCard>,

    // Sessions by country
    <ChartCard key="sessions-country" title="Sessions by country" className="w-96">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={sessionsByCountry} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="us" stackId="a" fill="#0EA5E9" />
          <Bar dataKey="ca" stackId="a" fill="#8B5CF6" />
          <Bar dataKey="uk" stackId="a" fill="#5C6AC4" />
          <Bar dataKey="fr" stackId="a" fill="#E91E63" />
                </BarChart>
              </ResponsiveContainer>
      <div className="mt-1 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded mr-1"></div>
          <span className="text-gray-600">United States</span>
                </div>
                <div className="flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
          <span className="text-gray-600">Canada</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-600 rounded mr-1"></div>
          <span className="text-gray-600">United Kingdom</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-pink-500 rounded mr-1"></div>
          <span className="text-gray-600">France</span>
                </div>
              </div>
            </ChartCard>
  ], [grossSalesByCountry, sessionsByDevice, customersOverTime, totalSales, salesByProduct, grossSalesByDevice, sessionsByCountry, sessionsOverTime]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-lg text-gray-600 mt-4">Loading analytics data...</p>
                    </div>
                  </div>
              </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="analytics-grid" className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Shopify Analytics Dashboard</h1>
        </div>
        
        {/* Shopify Analytics Grid Layout */}
        <div className="mb-12">
          {/* Row 1: 4 cards side by side - Carousel */}
          <div className="carousel-container mb-6">
            <div 
              className={`carousel-track animate-scroll-slow ${isPaused ? 'paused' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
            
            {/* 1. Gross sales by country (horizontal bar chart, leftmost) */}
                        <ChartCard title="Gross sales by country" className="min-w-[380px]">
              <div className="space-y-4 mt-2">
                {grossSalesByCountry.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-24">{item.country}</span>
                    <div className="flex items-center flex-1 ml-4">
                      <div 
                        className="h-2 bg-blue-500 rounded mr-3"
                        style={{ width: `${(item.sales / 10000) * 190}px` }}
                    ></div>
                      <span className="text-sm font-medium text-gray-900">₹{item.sales/1000}K</span>
                </div>
                  </div>
                ))}
              </div>
            </ChartCard>

                        {/* 2. Sessions by device (donut chart, next) */}
            <ChartCard title="Sessions by device" className="min-w-[420px]">
              <div className="flex items-center h-48">
                <div className="w-48">
              <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sessionsByDevice}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sessionsByDevice.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold text-gray-900">
                        10K
                      </text>
                    </PieChart>
              </ResponsiveContainer>
                </div>
                <div className="ml-4 space-y-3">
                  {sessionsByDevice.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                      <span className="text-sm font-medium text-gray-900">{item.value},000</span>
                </div>
                  ))}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="ml-6">+1 more</span>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* 3. Customers over time (stacked area chart, next) */}
            <ChartCard title="Customers over time" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={customersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="firstTime" 
                    stackId="1"
                    stroke="#0EA5E9" 
                    fill="#0EA5E9" 
                    fillOpacity={0.35} 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recurring" 
                    stackId="1"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.25} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">First time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span className="text-gray-600">Recurring</span>
                </div>
              </div>
            </ChartCard>

            {/* 4. Total sales (line chart, rightmost) */}
            <ChartCard title="Total sales" className="min-w-[420px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                <div className="text-2xl font-bold text-gray-900">₹20,985,950</div>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  <span>42%</span>
                </div>
              </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={totalSales}>
                  <defs>
                    <radialGradient id="blueGlassGradient1" cx="0.5" cy="0" r="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.05} />
                    </radialGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="none"
                    fill="#38BDF8"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#38BDF8" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#94A3B8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#94A3B8' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded mr-1"></div>
                  <span className="text-gray-600">May 7–Jun 5, 2023</span>
                </div>
              </div>
            </ChartCard>

            {/* 5. Sessions by country (additional card to match second carousel length) */}
            <ChartCard title="Sessions by country" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsByCountry} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="us" stackId="a" fill="#0EA5E9" />
                  <Bar dataKey="ca" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="uk" stackId="a" fill="#5C6AC4" />
                  <Bar dataKey="fr" stackId="a" fill="#E91E63" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-1 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded mr-1"></div>
                  <span className="text-gray-600">United States</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span className="text-gray-600">Canada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded mr-1"></div>
                  <span className="text-gray-600">United Kingdom</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded mr-1"></div>
                  <span className="text-gray-600">France</span>
                </div>
              </div>
            </ChartCard>

            {/* 6. Sales by product (additional card) */}
            <ChartCard title="Sales by product" className="min-w-[380px]">
              <div className="space-y-4 mt-2">
                {salesByProduct.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-20">{item.product}</span>
                    <div className="flex items-center flex-1 ml-4">
                      <div 
                        className="h-2 bg-green-500 rounded mr-3"
                        style={{ width: `${(item.sales / 419719) * 160}px` }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">₹{item.sales/1000}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Duplicate set for seamless loop - Row 1 */}
            {/* 1. Gross sales by country (duplicate) */}
            <ChartCard title="Gross sales by country" className="flex-shrink-0 min-w-[380px]">
              <div className="space-y-4 mt-2">
                {grossSalesByCountry.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-24">{item.country}</span>
                    <div className="flex items-center flex-1 ml-4">
                      <div 
                        className="h-2 bg-blue-500 rounded mr-3"
                        style={{ width: `${(item.sales / 10000) * 190}px` }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">₹{item.sales/1000}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* 2. Sessions by device (duplicate) */}
            <ChartCard title="Sessions by device" className="flex-shrink-0 min-w-[500px]">
              <div className="flex items-center h-48">
                <div className="w-48">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sessionsByDevice}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sessionsByDevice.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold text-gray-900">
                        10K
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-6 flex-1 min-w-0 pr-4">
                  <div className="space-y-3">
                    {sessionsByDevice.map((item, index) => (
                      <div key={index} className="flex items-center justify-between w-full">
                        <div className="flex items-center min-w-0 flex-1">
                          <div 
                            className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-xs text-gray-700 truncate">{item.name}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900" style={{ marginLeft: '120px' }}>{item.value},000</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-gray-500 ml-6">+1 more</span>
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* 3. Customers over time (duplicate) */}
            <ChartCard title="Customers over time" className="flex-shrink-0 min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={customersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="firstTime" 
                    stackId="1"
                    stroke="#0EA5E9" 
                    fill="#0EA5E9" 
                    fillOpacity={0.35} 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recurring" 
                    stackId="1"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.25} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">First time</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span className="text-gray-600">Recurring</span>
                </div>
              </div>
            </ChartCard>

            {/* 4. Sessions over time (duplicate) */}
            <ChartCard title="Sessions over time" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsOverTime} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="current" fill="#0EA5E9" />
                  <Bar dataKey="previous" fill="#BAE6FD" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-sky-200 rounded mr-1"></div>
                  <span className="text-gray-600">Apr 22–Apr 28, 2024</span>
                </div>
              </div>
            </ChartCard>

            {/* 5. Total sales (duplicate) */}
            <ChartCard title="Total sales" className="flex-shrink-0 min-w-[420px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">₹20,985,950</div>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>42%</span>
                </div>
              </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={totalSales}>
                  <defs>
                    <radialGradient id="blueGlassGradient2" cx="0.5" cy="0" r="1">
                      <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#0EA5E9" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.05} />
                    </radialGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="none"
                    fill="#0EA5E9"
                    fillOpacity={0.4}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="none"
                    fill="#0EA5E9"
                    fillOpacity={0.2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="none"
                    fill="#0EA5E9"
                    fillOpacity={0.1}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#0EA5E9' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#94A3B8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#94A3B8' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-3 flex space-x-6 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
                  <span className="text-gray-600 font-medium">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-0.5 bg-gray-400 mr-2" style={{ borderTop: '2px dotted #94A3B8' }}></div>
                  <span className="text-gray-600 font-medium">May 7–Jun 5, 2023</span>
                </div>
              </div>
            </ChartCard>

            {/* Duplicate set for seamless infinite scroll */}
            {/* 1. Gross sales by country (duplicate) */}
            <ChartCard title="Gross sales by country" className="min-w-[380px]">
              <div className="space-y-4 mt-2">
                {grossSalesByCountry.map((item, index) => (
                  <div key={`dup-${index}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-24">{item.country}</span>
                    <div className="flex items-center flex-1 ml-4">
                      <div 
                        className="h-2 bg-blue-500 rounded mr-3"
                        style={{ width: `${(item.sales / 10000) * 190}px` }}
                    ></div>
                      <span className="text-sm font-medium text-gray-900">₹{item.sales/1000}K</span>
                </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* 2. Sessions by device (duplicate) */}
            <ChartCard title="Sessions by device" className="min-w-[420px]">
              <div className="flex items-center h-48">
                <div className="w-48">
              <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sessionsByDevice}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sessionsByDevice.map((entry, index) => (
                          <Cell key={`dup-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold text-gray-900">
                        10K
                      </text>
                    </PieChart>
              </ResponsiveContainer>
                </div>
                <div className="ml-4 space-y-3">
                  {sessionsByDevice.map((item, index) => (
                    <div key={`dup-${index}`} className="flex items-center justify-between">
                <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                      <span className="text-sm font-medium text-gray-900">{item.value},000</span>
                </div>
                  ))}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="ml-6">+1 more</span>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* 3. Customers over time (duplicate) */}
            <ChartCard title="Customers over time" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={customersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="firstTime" 
                    stackId="1"
                    stroke="#0EA5E9" 
                    fill="#0EA5E9" 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recurring" 
                    stackId="1"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-3 flex space-x-6 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
                  <span className="text-gray-600 font-medium">First-time customers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-0.5 bg-purple-500 mr-2"></div>
                  <span className="text-gray-600 font-medium">Returning customers</span>
                </div>
              </div>
            </ChartCard>

            {/* 4. Total sales (duplicate) */}
            <ChartCard title="Total sales" className="min-w-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                <div className="text-2xl font-bold text-gray-900">₹20,985,950</div>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  <span>42%</span>
                </div>
              </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={totalSales}>
                  <defs>
                    <radialGradient id="blueGlassGradient3" cx="0.5" cy="0" r="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.05} />
                    </radialGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="none"
                    fill="#38BDF8"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#38BDF8" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#94A3B8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#94A3B8' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded mr-1"></div>
                  <span className="text-gray-600">May 7–Jun 5, 2023</span>
                </div>
              </div>
            </ChartCard>

            {/* 5. Sessions by country (duplicate) */}
            <ChartCard title="Sessions by country" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsByCountry} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="us" stackId="a" fill="#0EA5E9" />
                  <Bar dataKey="ca" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="uk" stackId="a" fill="#5C6AC4" />
                  <Bar dataKey="fr" stackId="a" fill="#E91E63" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-1 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded mr-1"></div>
                  <span className="text-gray-600">United States</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span className="text-gray-600">Canada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded mr-1"></div>
                  <span className="text-gray-600">United Kingdom</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded mr-1"></div>
                  <span className="text-gray-600">France</span>
                </div>
              </div>
            </ChartCard>

            {/* 6. Sales by product (duplicate) */}
            <ChartCard title="Sales by product" className="min-w-[380px]">
              <div className="space-y-4 mt-2">
                {salesByProduct.map((item, index) => (
                  <div key={`dup-sales-${index}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-20">{item.product}</span>
                    <div className="flex items-center flex-1 ml-4">
                      <div 
                        className="h-2 bg-green-500 rounded mr-3"
                        style={{ width: `${(item.sales / 419719) * 160}px` }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">₹{item.sales/1000}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
              </div>
            </div>
            
          {/* Row 2: 3 cards side by side - Carousel (Staggered) */}
          <div className="mt-8">
          <div className="carousel-container">
            <div 
              className={`carousel-track animate-scroll-slow ${isPaused ? 'paused' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
            
            {/* 1. Sales by product name (horizontal stacked bar, leftmost) */}
            <ChartCard title="Sales by product name" className="min-w-[450px]">
              <div className="space-y-3 mb-4">
                {salesByProduct.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded mr-3" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-700">{item.product}</span>
          </div>
                    <span className="font-medium text-gray-900">₹{item.sales.toLocaleString()}</span>
        </div>
                ))}
                <div className="text-sm text-gray-500 ml-6">+3 more</div>
      </div>
              <div className="mt-4">
                <div className="flex h-8 rounded overflow-hidden">
                  {salesByProduct.map((item, index) => (
                    <div 
                      key={index}
                      className="h-full"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.sales / 419719) * 100}%`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </ChartCard>

            {/* 2. Sessions over time (duplicate) */}
            <ChartCard title="Sessions over time" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsOverTime} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="current" fill="#0EA5E9" />
                  <Bar dataKey="previous" fill="#BAE6FD" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-sky-200 rounded mr-1"></div>
                  <span className="text-gray-600">Apr 22–Apr 28, 2024</span>
                </div>
              </div>
            </ChartCard>

            {/* 3. Gross sales by device (multi-line chart, center) */}
            <ChartCard title="Gross sales by device" className="min-w-[450px]">
              <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={grossSalesByDevice}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="mobile" 
                    stroke="none"
                    fill="#0EA5E9"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="desktop" 
                    stroke="none"
                    fill="#8B5CF6"
                    fillOpacity={0.25}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tablet" 
                    stroke="none"
                    fill="#1E40AF"
                    fillOpacity={0.2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mobile" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="desktop" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tablet" 
                    stroke="#1E40AF" 
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-blue-400 mr-1"></div>
                  <span className="text-gray-600">Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-purple-500 mr-1"></div>
                  <span className="text-gray-600">Desktop</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-blue-800 mr-1"></div>
                  <span className="text-gray-600">Tablet</span>
                </div>
              </div>
            </ChartCard>

            {/* 3. Sessions by country (stacked bar chart, rightmost) */}
            <ChartCard title="Sessions by country" className="min-w-[450px]">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={sessionsByCountry} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="us" stackId="a" fill="#0EA5E9" />
                  <Bar dataKey="ca" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="uk" stackId="a" fill="#5C6AC4" />
                  <Bar dataKey="fr" stackId="a" fill="#E91E63" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-1 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded mr-1"></div>
                  <span className="text-gray-600">United States</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span className="text-gray-600">Canada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded mr-1"></div>
                  <span className="text-gray-600">United Kingdom</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded mr-1"></div>
                  <span className="text-gray-600">France</span>
                </div>
              </div>
            </ChartCard>

            {/* 4. Conversion Rate (new card) */}
            <ChartCard title="Conversion Rate">
              <div className="text-center py-4">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                    <div className="text-xl font-bold text-white">{conversionRate.rate || 3.2}%</div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="text-sm text-gray-600 font-medium">Average conversion rate</div>
                  <div className="text-xs text-emerald-600 font-semibold tracking-wide">+{conversionRate.growth || 0.8}% from last month</div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-800">Monthly Progress</span>
                  <span className="text-xs text-gray-500 font-medium">Target: {conversionRate.target || 4.0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full shadow-sm" style={{ width: `${conversionRate.progress || 80}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>0%</span>
                  <span>2%</span>
                  <span>4%</span>
                  <span>6%</span>
                </div>
              </div>
            </ChartCard>

            {/* 5. Customer Satisfaction (new card) */}
            <ChartCard title="Customer Satisfaction">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{customerSatisfaction.rating || 4.8}★</div>
                    <div className="text-sm text-emerald-600 font-medium">{customerSatisfaction.status || "Excellent Rating"}</div>
                    <div className="text-xs text-gray-500">Based on {(customerSatisfaction.reviews || 2847).toLocaleString()} reviews</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">This Month</div>
                  <div className="text-lg font-bold text-emerald-600">+{customerSatisfaction.monthlyGrowth || 12}%</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Satisfied</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${customerSatisfaction.satisfied || 85}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{customerSatisfaction.satisfied || 85}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Neutral</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${customerSatisfaction.neutral || 10}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{customerSatisfaction.neutral || 10}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Dissatisfied</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${customerSatisfaction.dissatisfied || 5}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{customerSatisfaction.dissatisfied || 5}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last updated: {customerSatisfaction.lastUpdated ? new Date(customerSatisfaction.lastUpdated).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  }) : "2 hours ago"}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Live data</span>
                  </div>
                </div>
              </div>
            </ChartCard>
            
            {/* Duplicate set for seamless loop - Row 2 */}
            {/* 1. Sales by product name (duplicate) */}
            <ChartCard title="Sales by product name" className="flex-shrink-0 min-w-[450px]">
              <div className="space-y-3 mb-4">
                {salesByProduct.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded mr-3" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-700">{item.product}</span>
                    </div>
                    <span className="font-medium text-gray-900">₹{item.sales.toLocaleString()}</span>
                  </div>
                ))}
                <div className="text-sm text-gray-500 ml-6">+3 more</div>
              </div>
              <div className="mt-4">
                <div className="flex h-8 rounded overflow-hidden">
                  {salesByProduct.map((item, index) => (
                    <div 
                      key={index}
                      className="h-full"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.sales / 419719) * 100}%`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </ChartCard>

            {/* 2. Gross sales by device (duplicate) */}
            <ChartCard title="Gross sales by device" className="flex-shrink-0 min-w-[450px]">
              <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={grossSalesByDevice}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="mobile" 
                    stroke="none"
                    fill="#0EA5E9"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="desktop" 
                    stroke="none"
                    fill="#8B5CF6"
                    fillOpacity={0.25}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tablet" 
                    stroke="none"
                    fill="#1E40AF"
                    fillOpacity={0.2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mobile" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="desktop" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tablet" 
                    stroke="#1E40AF" 
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-blue-400 mr-1"></div>
                  <span className="text-gray-600">Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-purple-500 mr-1"></div>
                  <span className="text-gray-600">Desktop</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0.5 bg-blue-800 mr-1"></div>
                  <span className="text-gray-600">Tablet</span>
                </div>
              </div>
            </ChartCard>

            {/* 3. Sessions by country (duplicate) */}
            <ChartCard title="Sessions by country" className="flex-shrink-0 min-w-[450px]">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={sessionsByCountry} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="us" stackId="a" fill="#0EA5E9" />
                  <Bar dataKey="ca" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="uk" stackId="a" fill="#5C6AC4" />
                  <Bar dataKey="fr" stackId="a" fill="#E91E63" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-1 flex space-x-3 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded mr-1"></div>
                  <span className="text-gray-600">United States</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                  <span className="text-gray-600">Canada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded mr-1"></div>
                  <span className="text-gray-600">United Kingdom</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded mr-1"></div>
                  <span className="text-gray-600">France</span>
                </div>
              </div>
            </ChartCard>

            {/* 4. Sessions over time (duplicate) */}
            <ChartCard title="Sessions over time" className="min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsOverTime} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    ticks={[0, 5000, 10000]}
                    tickFormatter={(value) => `${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="current" fill="#0EA5E9" />
                  <Bar dataKey="previous" fill="#BAE6FD" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-sky-200 rounded mr-1"></div>
                  <span className="text-gray-600">Apr 22–Apr 28, 2024</span>
                </div>
              </div>
            </ChartCard>

            {/* 5. Conversion Rate (duplicate) */}
            <ChartCard title="Conversion Rate" className="flex-shrink-0">
              <div className="text-center py-4">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                    <div className="text-xl font-bold text-white">{conversionRate.rate || 3.2}%</div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="text-sm text-gray-600 font-medium">Average conversion rate</div>
                  <div className="text-xs text-emerald-600 font-semibold tracking-wide">+{conversionRate.growth || 0.8}% from last month</div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-800">Monthly Progress</span>
                  <span className="text-xs text-gray-500 font-medium">Target: {conversionRate.target || 4.0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full shadow-sm" style={{ width: `${conversionRate.progress || 80}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>0%</span>
                  <span>2%</span>
                  <span>4%</span>
                  <span>6%</span>
                </div>
              </div>
            </ChartCard>

            {/* 6. Customer Satisfaction (duplicate) */}
            <ChartCard title="Customer Satisfaction" className="flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{customerSatisfaction.rating || 4.8}★</div>
                    <div className="text-sm text-emerald-600 font-medium">{customerSatisfaction.status || "Excellent Rating"}</div>
                    <div className="text-xs text-gray-500">Based on {(customerSatisfaction.reviews || 2847).toLocaleString()} reviews</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">This Month</div>
                  <div className="text-lg font-bold text-emerald-600">+{customerSatisfaction.monthlyGrowth || 12}%</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Satisfied</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${customerSatisfaction.satisfied || 85}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{customerSatisfaction.satisfied || 85}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Neutral</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${customerSatisfaction.neutral || 10}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{customerSatisfaction.neutral || 10}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Dissatisfied</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${customerSatisfaction.dissatisfied || 5}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{customerSatisfaction.dissatisfied || 5}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last updated: {customerSatisfaction.lastUpdated ? new Date(customerSatisfaction.lastUpdated).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  }) : "2 hours ago"}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Live data</span>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* 6. Average Order Value */}
            <ChartCard title="Average Order Value" className="min-w-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">₹2,847</div>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>18%</span>
                  </div>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={[
                  { month: 'Jan', value: 2100 },
                  { month: 'Feb', value: 2300 },
                  { month: 'Mar', value: 2500 },
                  { month: 'Apr', value: 2400 },
                  { month: 'May', value: 2600 },
                  { month: 'Jun', value: 2847 }
                ]}>
                  <defs>
                    <linearGradient id="aovGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    fill="url(#aovGradient)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded mr-1"></div>
                  <span className="text-gray-600">Average Order Value</span>
                </div>
              </div>
            </ChartCard>

            {/* 7. Return Rate */}
            <ChartCard title="Return Rate" className="min-w-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">3.2%</div>
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>0.5%</span>
                  </div>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  { month: 'Jan', returns: 4.1 },
                  { month: 'Feb', returns: 3.8 },
                  { month: 'Mar', returns: 3.5 },
                  { month: 'Apr', returns: 3.9 },
                  { month: 'May', returns: 3.3 },
                  { month: 'Jun', returns: 3.2 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="returns" 
                    fill="#EF4444" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded mr-1"></div>
                  <span className="text-gray-600">Return Rate</span>
                </div>
              </div>
            </ChartCard>

            {/* 8. Total sales (additional card to match first carousel length) */}
            <ChartCard title="Total sales" className="min-w-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                <div className="text-2xl font-bold text-gray-900">₹20,985,950</div>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  <span>42%</span>
                </div>
              </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={totalSales}>
                  <defs>
                    <radialGradient id="blueGlassGradient4" cx="0.5" cy="0" r="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.05} />
                    </radialGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="none"
                    fill="#0EA5E9"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#94A3B8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#94A3B8' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded mr-1"></div>
                  <span className="text-gray-600">May 7–Jun 5, 2023</span>
                </div>
              </div>
            </ChartCard>

            {/* 6. Total sales (duplicate) */}
            <ChartCard title="Total sales" className="min-w-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                <div className="text-2xl font-bold text-gray-900">₹20,985,950</div>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  <span>42%</span>
                </div>
              </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={totalSales}>
                  <defs>
                    <radialGradient id="blueGlassGradient5" cx="0.5" cy="0" r="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.05} />
                    </radialGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();
                      return `${month} ${day}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="none"
                    fill="#0EA5E9"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#94A3B8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#94A3B8' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Jun 6–Jul 5, 2023</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded mr-1"></div>
                  <span className="text-gray-600">May 7–Jun 5, 2023</span>
                </div>
              </div>
            </ChartCard>

            {/* 7. Average Order Value (duplicate) */}
            <ChartCard title="Average Order Value" className="min-w-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">₹2,847</div>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>18%</span>
                  </div>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={[
                  { month: 'Jan', value: 2100 },
                  { month: 'Feb', value: 2300 },
                  { month: 'Mar', value: 2500 },
                  { month: 'Apr', value: 2400 },
                  { month: 'May', value: 2600 },
                  { month: 'Jun', value: 2847 }
                ]}>
                  <defs>
                    <linearGradient id="aovGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    fill="url(#aovGradient2)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded mr-1"></div>
                  <span className="text-gray-600">Average Order Value</span>
                </div>
              </div>
            </ChartCard>

            {/* 8. Return Rate (duplicate) */}
            <ChartCard title="Return Rate" className="min-w-[400px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">3.2%</div>
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>0.5%</span>
                  </div>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  { month: 'Jan', returns: 4.1 },
                  { month: 'Feb', returns: 3.8 },
                  { month: 'Mar', returns: 3.5 },
                  { month: 'Apr', returns: 3.9 },
                  { month: 'May', returns: 3.3 },
                  { month: 'Jun', returns: 3.2 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="returns" 
                    fill="#EF4444" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded mr-1"></div>
                  <span className="text-gray-600">Return Rate</span>
                </div>
              </div>
            </ChartCard>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AnalyticsGrid;