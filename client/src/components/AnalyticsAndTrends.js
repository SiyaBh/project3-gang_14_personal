import React, { useEffect, useState } from 'react';
import { getProductUsage, getXReport, getZReport } from '../api/trends';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const TrendsAndAnalytics = () => {
  const [usageData, setUsageData] = useState([]);
  const [xData, setXData] = useState([]);
  const [zData, setZData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('Product Usage');

  // Fetch Z report only once
  useEffect(() => {
    const fetchZ = async () => {
      try {
        const zReport = await getZReport();
        setZData(zReport);
      } catch (err) {
        console.error('Error fetching Z report:', err);
        setError('Failed to load Z report');
      }
    };
    fetchZ();
  }, []);

  // Fetch usage and X reports
  useEffect(() => {
    const fetchUsageAndX = async () => {
      try {
        const [usage, xReport] = await Promise.all([
          getProductUsage(),
          getXReport(),
        ]);
        setUsageData(usage);
        setXData(xReport);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchUsageAndX();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading reports...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const renderBarChart = (data, xKey, yKey, title, fill, yLabel) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} angle={-30} textAnchor="end" interval={0} height={60} />
            <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill={fill} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No data available.</p>
      )}
    </div>
  );

  const getSelectedChart = () => {
    switch (selectedChart) {
      case 'Product Usage':
        return renderBarChart(usageData, 'product_name', 'total_sold', 'Product Usage Trends', '#82ca9d', 'Units Sold');
      case 'X Report':
        return renderBarChart(xData, 'hour', 'total_sales', 'X Report (Revenue per Hour)', '#8884d8', 'Revenue ($)');
      case 'Z Report':
        return renderBarChart(zData, 'hour', 'cumulative_sales', 'Z Report (Cumulative Sales)', '#ffc658', 'Cumulative Revenue ($)');
      default:
        return <p className="text-center text-gray-500">Select a chart to view.</p>;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 text-center">
        <label htmlFor="chartSelect" className="mr-2 font-medium">Select Chart:</label>
        <select
          id="chartSelect"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="Product Usage">Product Usage</option>
          <option value="X Report">X Report</option>
          <option value="Z Report">Z Report</option>
        </select>
      </div>

      {getSelectedChart()}
    </div>
  );
};

export default TrendsAndAnalytics;
