import React from 'react';
import { Portfolio } from '../../types';

interface AllocationChartProps {
  portfolio: Portfolio[];
}

const AllocationChart: React.FC<AllocationChartProps> = ({ portfolio }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <div className="flex justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            {portfolio.map((holding, index) => {
              const radius = 60;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(holding.allocation / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -portfolio
                .slice(0, index)
                .reduce((acc, h) => acc + (h.allocation / 100) * circumference, 0);

              return (
                <circle
                  key={holding.symbol}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {portfolio.map((holding, index) => (
          <div key={holding.symbol} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-300">{holding.symbol}</span>
            </div>
            <span className="text-sm text-white font-medium">
              {holding.allocation.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationChart;