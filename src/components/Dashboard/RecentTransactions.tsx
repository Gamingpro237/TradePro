import React from 'react';
import { Transaction } from '../../types';

const RecentTransactions: React.FC = () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 25,
      price: 175.50,
      total: 4387.50,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '2',
      symbol: 'GOOGL',
      type: 'sell',
      quantity: 10,
      price: 142.80,
      total: 1428.00,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '3',
      symbol: 'MSFT',
      type: 'buy',
      quantity: 15,
      price: 378.25,
      total: 5673.75,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '4',
      symbol: 'TSLA',
      type: 'sell',
      quantity: 5,
      price: 248.00,
      total: 1240.00,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'pending'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-sm font-medium text-gray-400 pb-2">Symbol</th>
              <th className="text-left text-sm font-medium text-gray-400 pb-2">Type</th>
              <th className="text-left text-sm font-medium text-gray-400 pb-2">Quantity</th>
              <th className="text-left text-sm font-medium text-gray-400 pb-2">Price</th>
              <th className="text-left text-sm font-medium text-gray-400 pb-2">Total</th>
              <th className="text-left text-sm font-medium text-gray-400 pb-2">Date</th>
              <th className="text-left text-sm font-medium text-gray-400 pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-700">
                <td className="py-3 text-white font-medium">{transaction.symbol}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.type === 'buy' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {transaction.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 text-gray-300">{transaction.quantity}</td>
                <td className="py-3 text-gray-300">${transaction.price.toFixed(2)}</td>
                <td className="py-3 text-white font-medium">${transaction.total.toFixed(2)}</td>
                <td className="py-3 text-gray-400 text-sm">
                  {transaction.date.toLocaleDateString()}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.status === 'completed' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;