import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const PortfolioChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1D');
  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  // Mock chart data
  const generateChartData = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: 100000 + Math.random() * 50000
      });
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>
        </div>
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-white">$125,480.75</span>
          <div className="flex items-center space-x-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+1.24%</span>
          </div>
        </div>
        <p className="text-sm text-gray-400">+$1,520.30 today</p>
      </div>

      {/* Simple chart visualization */}
      <div className="relative h-64">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Chart area */}
          <path
            d={`M 0 200 ${chartData.map((_, i) => `L ${(i * 800) / chartData.length} ${200 - (Math.random() * 100)}`).join(' ')}`}
            fill="url(#gradient)"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 50}
              x2="100%"
              y2={i * 50}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default PortfolioChart;