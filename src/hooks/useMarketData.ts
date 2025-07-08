import { useState, useEffect } from 'react';
import { Asset, ChartData } from '../types';

export const useMarketData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    const mockAssets: Asset[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.84,
        change: 2.34,
        changePercent: 1.35,
        volume: 45678901,
        marketCap: 2750000000000,
        high52Week: 198.23,
        low52Week: 124.17,
        peRatio: 28.5,
        dividend: 0.24,
        beta: 1.2
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.56,
        change: -1.23,
        changePercent: -0.85,
        volume: 23456789,
        marketCap: 1800000000000,
        high52Week: 151.55,
        low52Week: 83.34,
        peRatio: 25.3,
        dividend: 0.0,
        beta: 1.1
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 378.91,
        change: 4.67,
        changePercent: 1.25,
        volume: 34567890,
        marketCap: 2820000000000,
        high52Week: 384.30,
        low52Week: 213.43,
        peRatio: 32.1,
        dividend: 0.68,
        beta: 0.9
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        price: 248.42,
        change: -5.78,
        changePercent: -2.28,
        volume: 67890123,
        marketCap: 790000000000,
        high52Week: 414.50,
        low52Week: 101.81,
        peRatio: 75.4,
        dividend: 0.0,
        beta: 2.0
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        price: 145.78,
        change: 1.89,
        changePercent: 1.31,
        volume: 56789012,
        marketCap: 1520000000000,
        high52Week: 188.11,
        low52Week: 81.43,
        peRatio: 58.7,
        dividend: 0.0,
        beta: 1.3
      }
    ];

    setAssets(mockAssets);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        price: asset.price + (Math.random() - 0.5) * 2,
        change: asset.change + (Math.random() - 0.5) * 0.5,
        changePercent: asset.changePercent + (Math.random() - 0.5) * 0.2
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getChartData = (symbol: string): ChartData[] => {
    // Generate mock chart data
    const data: ChartData[] = [];
    const basePrice = assets.find(a => a.symbol === symbol)?.price || 100;
    
    for (let i = 0; i < 100; i++) {
      const price = basePrice + (Math.random() - 0.5) * 10;
      data.push({
        time: new Date(Date.now() - (99 - i) * 60000).toISOString(),
        open: price,
        high: price + Math.random() * 2,
        low: price - Math.random() * 2,
        close: price + (Math.random() - 0.5) * 1,
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    
    return data;
  };

  return {
    assets,
    loading,
    getChartData
  };
};