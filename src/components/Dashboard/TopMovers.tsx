import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Asset } from '../../types';

interface TopMoversProps {
  assets: Asset[];
}

const TopMovers: React.FC<TopMoversProps> = ({ assets }) => {
  const topGainers = assets
    .filter(asset => asset.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);

  const topLosers = assets
    .filter(asset => asset.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Top Movers</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Gainers
          </h3>
          <div className="space-y-2">
            {topGainers.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{asset.symbol}</div>
                  <div className="text-xs text-gray-400">${asset.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">
                    +{asset.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-xs text-green-400">
                    +${asset.change.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center">
            <TrendingDown className="w-4 h-4 mr-1" />
            Losers
          </h3>
          <div className="space-y-2">
            {topLosers.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{asset.symbol}</div>
                  <div className="text-xs text-gray-400">${asset.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-medium">
                    {asset.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-xs text-red-400">
                    ${asset.change.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMovers;