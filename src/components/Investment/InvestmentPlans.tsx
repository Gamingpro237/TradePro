import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, Plus, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { investmentHelpers } from '../../lib/supabase';
import { InvestmentPlan, PlanOption } from '../../types';
import CreatePlanModal from './CreatePlanModal';
import PlanCard from './PlanCard';

const InvestmentPlans: React.FC = () => {
  const { authUser } = useAuth();
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const planOptions: PlanOption[] = [
    {
      type: '2000',
      amount: 2000,
      dailyGain: 60,
      title: 'Starter Plan',
      description: 'Perfect for beginners looking to start their investment journey',
    },
    {
      type: '5000',
      amount: 5000,
      dailyGain: 160,
      title: 'Growth Plan',
      description: 'Ideal for investors seeking steady growth',
      popular: true,
    },
    {
      type: '10000',
      amount: 10000,
      dailyGain: 330,
      title: 'Premium Plan',
      description: 'For serious investors wanting higher returns',
    },
    {
      type: '20000',
      amount: 20000,
      dailyGain: 660,
      title: 'Elite Plan',
      description: 'Maximum returns for high-value investors',
    },
  ];

  useEffect(() => {
    if (authUser) {
      loadPlans();
    }
  }, [authUser]);

  const loadPlans = async () => {
    if (!authUser) return;

    try {
      const { data, error } = await investmentHelpers.getUserPlans(authUser.id);
      if (error) {
        console.error('Error loading plans:', error);
        return;
      }
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (planType: string, amount: number) => {
    if (!authUser) return;

    try {
      const { data, error } = await investmentHelpers.createPlan(authUser.id, planType, amount);
      if (error) {
        console.error('Error creating plan:', error);
        return;
      }
      
      if (data) {
        setPlans([data, ...plans]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const activePlans = plans.filter(plan => plan.is_active);
  const totalBalance = activePlans.reduce((sum, plan) => sum + plan.current_balance, 0);
  const totalGained = activePlans.reduce((sum, plan) => sum + plan.total_gained, 0);
  const dailyGainTotal = activePlans.reduce((sum, plan) => sum + plan.daily_increment, 0);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white">Loading investment plans...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
          Investment Plans
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Plan</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-white">${totalBalance.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Gained</p>
              <p className="text-2xl font-bold text-green-400">${totalGained.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Daily Gains</p>
              <p className="text-2xl font-bold text-yellow-400">${dailyGainTotal.toLocaleString()}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Your Active Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Available Investment Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planOptions.map((option) => (
            <div
              key={option.type}
              className={`relative bg-gray-800 rounded-lg p-6 border transition-all hover:border-blue-500 ${
                option.popular ? 'border-blue-500' : 'border-gray-700'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{option.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">
                    ${option.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Initial Investment</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Daily Gain:</span>
                    <span className="text-green-400 font-medium">${option.dailyGain}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Monthly Gain:</span>
                    <span className="text-green-400 font-medium">${(option.dailyGain * 30).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Annual Return:</span>
                    <span className="text-green-400 font-medium">
                      {((option.dailyGain * 365 / option.amount) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCreatePlan(option.type, option.amount)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <CreatePlanModal
          planOptions={planOptions}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePlan}
        />
      )}
    </div>
  );
};

export default InvestmentPlans;