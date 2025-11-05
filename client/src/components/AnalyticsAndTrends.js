import React, { useEffect, useState } from 'react';
import { getProductUsage } from '../api/trends'; 
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const TrendsAndAnalytics = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await getProductUsage();
        setUsageData(data);
      } catch (err) {
        console.error('Error fetching usage data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading chart...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6"> Product Usage Trends</h1>

      {usageData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={usageData}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                barCategoryGap="5%"      // smaller gap between bars
                barGap={2}               // gap between grouped bars (if multiple)
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="product_name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                dataKey="total_sold" 
                fill="#82ca9d" 
                name="Units Sold"
                maxBarSize={80}       // max width of each bar
                />
            </BarChart>
            </ResponsiveContainer>

      ) : (
        <p className="text-center text-gray-500">No product usage data available.</p>
      )}
    </div>
  );
};

export default TrendsAndAnalytics;
