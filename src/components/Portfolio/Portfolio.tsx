import React from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { Briefcase, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import AllocationChart from './AllocationChart';

const Portfolio: React.FC = () => {
  const { portfolio, getTotalValue, getTotalGainLoss, getTotalGainLossPercent } = usePortfolio();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Briefcase className="w-6 h-6 mr-2 text-blue-400" />
          Portfolio
        </h1>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Value</h3>
          <p className="text-2xl font-bold text-white">${getTotalValue().toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Gain/Loss</h3>
          <div className="flex items-center space-x-2">
            <p className={`text-2xl font-bold ${
              getTotalGainLoss() >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${getTotalGainLoss().toLocaleString()}
            </p>
            {getTotalGainLoss() >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Return</h3>
          <p className={`text-2xl font-bold ${
            getTotalGainLossPercent() >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {getTotalGainLossPercent() >= 0 ? '+' : ''}{getTotalGainLossPercent().toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-sm font-medium text-gray-400 pb-2">Symbol</th>
                  <th className="text-left text-sm font-medium text-gray-400 pb-2">Quantity</th>
                  <th className="text-left text-sm font-medium text-gray-400 pb-2">Avg Cost</th>
                  <th className="text-left text-sm font-medium text-gray-400 pb-2">Current Price</th>
                  <th className="text-left text-sm font-medium text-gray-400 pb-2">Total Value</th>
                  <th className="text-left text-sm font-medium text-gray-400 pb-2">Gain/Loss</th>
                  <th className="text-left text-sm font-medium text-gray-400 pb-2">%</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-gray-700">
                    <td className="py-3">
                      <div>
                        <div className="font-medium text-white">{holding.symbol}</div>
                        <div className="text-sm text-gray-400">{holding.name}</div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-300">{holding.quantity}</td>
                    <td className="py-3 text-gray-300">${holding.avgCost.toFixed(2)}</td>
                    <td className="py-3 text-white font-medium">${holding.currentPrice.toFixed(2)}</td>
                    <td className="py-3 text-white font-medium">${holding.totalValue.toFixed(2)}</td>
                    <td className="py-3">
                      <div className={`font-medium ${
                        holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${holding.gainLoss.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className={`font-medium ${
                        holding.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-400" />
            Allocation
          </h2>
          <AllocationChart portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;