import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from 'recharts';
  
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 600 },
    { name: 'Mar', value: 300 },
    { name: 'Apr', value: 900 },
    { name: 'May', value: 700 },
  ];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border rounded shadow px-3 py-2">
          <p className="font-semibold">{label}</p>
          <p className="text-indigo-500">Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };
  
  const MyLineChart = () => {
    return (
      <div className='w-full h-full'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
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
  
  export default MyLineChart;
  