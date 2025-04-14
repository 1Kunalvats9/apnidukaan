import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from 'recharts';

  const dataDummy = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border rounded shadow px-3 py-2">
          <p className="font-semibold">{label}</p>
          <p className="text-indigo-500">Income: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const IncomeChart = ({ userData }) => {
    const [monthlyIncomeData, setMonthlyIncomeData] = useState([]);

    useEffect(() => {
      if (userData && userData.checkoutHistory && userData.checkoutHistory.length > 0) {
        const monthlyIncome = {};

        userData.checkoutHistory.forEach((checkout) => {
          const date = new Date(checkout.dateOfCheckout);
          const year = date.getFullYear();
          const month = date.toLocaleString('default', { month: 'short' });
          const monthYear = `${month} ${year}`;

          monthlyIncome[monthYear] = (monthlyIncome[monthYear] || 0) + checkout.totalPrice;
        });

        const chartData = Object.entries(monthlyIncome)
          .sort(([, valueA], [, valueB]) => valueB - valueA)
          .map(([monthYear, total]) => ({ name: monthYear, value: total }));

        setMonthlyIncomeData(chartData);
      } else {
        setMonthlyIncomeData(dataDummy);
      }
    }, [userData]);

    return (
      <div className='w-full h-full'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyIncomeData}
            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#4a5568" />
            <YAxis stroke="#4a5568" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  export default IncomeChart;