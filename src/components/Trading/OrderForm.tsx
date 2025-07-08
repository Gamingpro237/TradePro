import React, { useState } from 'react';
import { DollarSign, Calculator, AlertCircle } from 'lucide-react';
import { Asset } from '../../types';

interface OrderFormProps {
  selectedAsset?: Asset;
}

const OrderForm: React.FC<OrderFormProps> = ({ selectedAsset }) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [orderMethod, setOrderMethod] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState('day');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    console.log('Order submitted:', {
      symbol: selectedAsset?.symbol,
      type: orderType,
      method: orderMethod,
      quantity,
      price,
      timeInForce
    });
  };

  const estimatedTotal = selectedAsset && quantity ? 
    parseFloat(quantity) * (orderMethod === 'market' ? selectedAsset.price : parseFloat(price || '0')) : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
        Place Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Buy/Sell Toggle */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              orderType === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              orderType === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Order Type</label>
          <select
            value={orderMethod}
            onChange={(e) => setOrderMethod(e.target.value as 'market' | 'limit')}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quantity"
          />
        </div>

        {/* Price (for limit orders) */}
        {orderMethod === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Limit Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter limit price"
            />
          </div>
        )}

        {/* Time in Force */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Time in Force</label>
          <select
            value={timeInForce}
            onChange={(e) => setTimeInForce(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Day</option>
            <option value="gtc">Good Till Cancelled</option>
            <option value="ioc">Immediate or Cancel</option>
            <option value="fok">Fill or Kill</option>
          </select>
        </div>

        {/* Order Summary */}
        {selectedAsset && quantity && (
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Symbol:</span>
              <span className="text-white">{selectedAsset.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Quantity:</span>
              <span className="text-white">{quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">
                {orderMethod === 'market' ? 'Market Price:' : 'Limit Price:'}
              </span>
              <span className="text-white">
                ${orderMethod === 'market' ? selectedAsset.price.toFixed(2) : (price || '0')}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-600 pt-2">
              <span className="text-gray-300">Estimated Total:</span>
              <span className="text-white font-medium">${estimatedTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedAsset || !quantity}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            orderType === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset?.symbol}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;