import React from 'react';
import { BarChart3 } from 'lucide-react';

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  // Mock order book data
  const bids = [
    { price: 175.82, size: 500, total: 500 },
    { price: 175.81, size: 750, total: 1250 },
    { price: 175.80, size: 1000, total: 2250 },
    { price: 175.79, size: 300, total: 2550 },
    { price: 175.78, size: 800, total: 3350 },
  ];

  const asks = [
    { price: 175.83, size: 400, total: 400 },
    { price: 175.84, size: 600, total: 1000 },
    { price: 175.85, size: 900, total: 1900 },
    { price: 175.86, size: 200, total: 2100 },
    { price: 175.87, size: 700, total: 2800 },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
        Order Book - {symbol}
      </h2>

      <div className="space-y-4">
        {/* Asks */}
        <div>
          <h3 className="text-sm font-medium text-red-400 mb-2">Asks</h3>
          <div className="space-y-1">
            {asks.reverse().map((ask, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-red-400">${ask.price.toFixed(2)}</span>
                <span className="text-gray-300">{ask.size}</span>
                <span className="text-gray-400">{ask.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="bg-gray-700 rounded p-2 text-center">
          <div className="text-xs text-gray-400">Spread</div>
          <div className="text-white font-medium">$0.01</div>
        </div>

        {/* Bids */}
        <div>
          <h3 className="text-sm font-medium text-green-400 mb-2">Bids</h3>
          <div className="space-y-1">
            {bids.map((bid, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-green-400">${bid.price.toFixed(2)}</span>
                <span className="text-gray-300">{bid.size}</span>
                <span className="text-gray-400">{bid.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;