import React, { useState } from 'react';
import { ShoppingCart, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { useAuth } from '../../hooks/useAuth';
import OrderForm from './OrderForm';
import OrderBook from './OrderBook';
import ActiveOrders from './ActiveOrders';

const TradingPanel: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const { assets } = useMarketData();
  const { user } = useAuth();

  const selectedAsset = assets.find(asset => asset.symbol === selectedSymbol);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2 text-blue-400" />
          Trading
        </h1>
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-gray-300">
            Buying Power: 
            <span className="text-white font-semibold ml-1">
              ${user?.availableBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Symbol Selector */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Symbol</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {assets.map(asset => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>
          {selectedAsset && (
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">${selectedAsset.price.toFixed(2)}</div>
                <div className={`text-sm font-medium ${
                  selectedAsset.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)} ({selectedAsset.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-1">
          <OrderForm selectedAsset={selectedAsset} />
        </div>

        {/* Order Book */}
        <div className="lg:col-span-1">
          <OrderBook symbol={selectedSymbol} />
        </div>

        {/* Active Orders */}
        <div className="lg:col-span-1">
          <ActiveOrders />
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;