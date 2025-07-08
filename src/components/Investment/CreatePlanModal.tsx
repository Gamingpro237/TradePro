import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, Calendar, Target } from 'lucide-react';
import { PlanOption } from '../../types';

interface CreatePlanModalProps {
  planOptions: PlanOption[];
  onClose: () => void;
  onCreate: (planType: string, amount: number) => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ planOptions, onClose, onCreate }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    const amount = customAmount ? parseFloat(customAmount) : selectedPlan.amount;
    
    try {
      await onCreate(selectedPlan.type, amount);
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedPlan?.amount || 0;
  const estimatedDailyGain = selectedPlan ? 
    (finalAmount / selectedPlan.amount) * selectedPlan.dailyGain : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create Investment Plan</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plan Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Select a Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedPlan(option)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPlan?.type === option.type
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{option.title}</h4>
                        {option.popular && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-bold">
                          ${option.amount.toLocaleString()}
                        </span>
                        <span className="text-green-400 text-sm">
                          +${option.dailyGain}/day
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            {selectedPlan && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Investment Amount</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Amount (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder={selectedPlan.amount.toString()}
                        min={selectedPlan.amount}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Minimum: ${selectedPlan.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Investment Summary */}
                  <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-white">Investment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plan:</span>
                        <span className="text-white">{selectedPlan.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Investment Amount:</span>
                        <span className="text-white">${finalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Gain:</span>
                        <span className="text-green-400">${estimatedDailyGain.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Gain:</span>
                        <span className="text-green-400">
                          ${(estimatedDailyGain * 30).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Annual Return:</span>
                        <span className="text-green-400">
                          {((estimatedDailyGain * 365 / finalAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!selectedPlan || loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;