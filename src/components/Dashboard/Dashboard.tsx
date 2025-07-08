import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useMarketData } from '../../hooks/useMarketData';
import PortfolioChart from './PortfolioChart';
import TopMovers from './TopMovers';
import RecentTransactions from './RecentTransactions';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTotalValue, getTotalGainLoss, getTotalGainLossPercent } = usePortfolio();
  const { assets } = useMarketData();

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: `$${getTotalValue().toLocaleString()}`,
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Day Gain/Loss',
      value: `$${user?.dayGainLoss.toLocaleString()}`,
      icon: user?.dayGainLoss >= 0 ? TrendingUp : TrendingDown,
      color: user?.dayGainLoss >= 0 ? 'green' : 'red'
    },
    {
      title: 'Total Gain/Loss',
      value: `${getTotalGainLossPercent() >= 0 ? '+' : ''}${getTotalGainLossPercent().toFixed(2)}%`,
      icon: getTotalGainLoss() >= 0 ? TrendingUp : TrendingDown,
      color: getTotalGainLoss() >= 0 ? 'green' : 'red'
    },
    {
      title: 'Available Balance',
      value: `$${user?.availableBalance.toLocaleString()}`,
      icon: BarChart3,
      color: 'purple'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'red' ? 'text-red-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    'text-white'
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'green' ? 'bg-green-500/10' :
                  stat.color === 'red' ? 'bg-red-500/10' :
                  stat.color === 'blue' ? 'bg-blue-500/10' :
                  stat.color === 'purple' ? 'bg-purple-500/10' :
                  'bg-gray-700'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'red' ? 'text-red-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    'text-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioChart />
        </div>
        <div>
          <TopMovers assets={assets} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;