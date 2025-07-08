import React from 'react';
import { Clock, X } from 'lucide-react';
import { Order } from '../../types';

const ActiveOrders: React.FC = () => {
  const mockOrders: Order[] = [
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      orderType: 'limit',
      quantity: 100,
      price: 175.00,
      timeInForce: 'gtc',
      status: 'open',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      symbol: 'GOOGL',
      type: 'sell',
      orderType: 'stop',
      quantity: 50,
      stopPrice: 140.00,
      timeInForce: 'day',
      status: 'open',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    }
  ];

  const handleCancelOrder = (orderId: string) => {
    console.log('Cancel order:', orderId);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-blue-400" />
        Active Orders
      </h2>

      <div className="space-y-4">
        {mockOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No active orders</p>
        ) : (
          mockOrders.map((order) => (
            <div key={order.id} className="bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white">{order.symbol}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.type === 'buy' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {order.type.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-1">{order.orderType}</span>
                </div>
                <div>
                  <span className="text-gray-400">Qty:</span>
                  <span className="text-white ml-1">{order.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white ml-1">
                    ${order.price?.toFixed(2) || order.stopPrice?.toFixed(2) || 'Market'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">TIF:</span>
                  <span className="text-white ml-1">{order.timeInForce.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                Created: {order.createdAt.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveOrders;