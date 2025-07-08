import { useState, useEffect } from 'react';
import { Portfolio } from '../types';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock portfolio data
    const mockPortfolio: Portfolio[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 50,
        avgCost: 165.50,
        currentPrice: 175.84,
        totalValue: 8792.00,
        gainLoss: 517.00,
        gainLossPercent: 6.25,
        allocation: 35.2
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 25,
        avgCost: 145.20,
        currentPrice: 142.56,
        totalValue: 3564.00,
        gainLoss: -66.00,
        gainLossPercent: -1.82,
        allocation: 14.3
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        quantity: 30,
        avgCost: 370.00,
        currentPrice: 378.91,
        totalValue: 11367.30,
        gainLoss: 267.30,
        gainLossPercent: 2.41,
        allocation: 45.5
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        quantity: 10,
        avgCost: 265.00,
        currentPrice: 248.42,
        totalValue: 2484.20,
        gainLoss: -165.80,
        gainLossPercent: -6.25,
        allocation: 5.0
      }
    ];

    setPortfolio(mockPortfolio);
    setLoading(false);
  }, []);

  const getTotalValue = () => {
    return portfolio.reduce((sum, item) => sum + item.totalValue, 0);
  };

  const getTotalGainLoss = () => {
    return portfolio.reduce((sum, item) => sum + item.gainLoss, 0);
  };

  const getTotalGainLossPercent = () => {
    const totalValue = getTotalValue();
    const totalGainLoss = getTotalGainLoss();
    return totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;
  };

  return {
    portfolio,
    loading,
    getTotalValue,
    getTotalGainLoss,
    getTotalGainLossPercent
  };
};