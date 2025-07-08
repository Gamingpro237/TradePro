import React from 'react';
import { TrendingUp, Calendar, DollarSign, Target } from 'lucide-react';
import { InvestmentPlan } from '../../types';

interface PlanCardProps {
  plan: InvestmentPlan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(plan.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const progressPercentage = plan.initial_amount > 0 
    ? (plan.total_gained / plan.initial_amount) * 100 
    : 0;

  const getPlanTitle = (planType: string) => {
    const titles = {
      '2000': 'Starter Plan',
      '5000': 'Growth Plan',
      '10000': 'Premium Plan',
      '20000': 'Elite Plan',
    };
    return titles[planType as keyof typeof titles] || 'Investment Plan';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {getPlanTitle(plan.plan_type)}
          </h3>
          <div className="flex items-center space-x-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>

        {/* Current Balance */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            ${plan.current_balance.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Current Balance</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              ${plan.initial_amount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Initial</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400">
              ${plan.total_gained.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total Gained</div>
          </div>
        </div>

        {/* Daily Gain */}
        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Daily Gain</span>
          </div>
          <span className="text-sm font-medium text-yellow-400">
            ${plan.daily_increment}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Days Active */}
        <div className="text-center text-sm text-gray-400">
          Active for {daysSinceStart} day{daysSinceStart !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;