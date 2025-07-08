import React, { useState } from 'react';
import { Eye, Plus, Bell, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { WatchlistItem } from '../../types';

const Watchlist: React.FC = () => {
  const { assets } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.84,
      change: 2.34,
      changePercent: 1.35,
      alert: {
        type: 'above',
        price: 180.00,
        enabled: true
      }
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.56,
      change: -1.23,
      changePercent: -0.85,
      alert: {
        type: 'below',
        price: 140.00,
        enabled: false
      }
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 378.91,
      change: 4.67,
      changePercent: 1.25
    }
  ]);

  const filteredAssets = assets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToWatchlist = (asset: any) => {
    if (!watchlist.find(item => item.symbol === asset.symbol)) {
      setWatchlist([...watchlist, {
        symbol: asset.symbol,
        name: asset.name,
        price: asset.price,
        change: asset.change,
        changePercent: asset.changePercent
      }]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  const toggleAlert = (symbol: string) => {
    setWatchlist(watchlist.map(item => 
      item.symbol === symbol && item.alert
        ? { ...item, alert: { ...item.alert, enabled: !item.alert.enabled } }
        : item
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Eye className="w-6 h-6 mr-2 text-blue-400" />
          Watchlist
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Watchlist */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">My Watchlist</h2>
          
          {watchlist.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Your watchlist is empty</p>
          ) : (
            <div className="space-y-3">
              {watchlist.map((item) => (
                <div key={item.symbol} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{item.symbol}</h3>
                        {item.alert && (
                          <button
                            onClick={() => toggleAlert(item.symbol)}
                            className={`p-1 rounded ${
                              item.alert.enabled 
                                ? 'text-yellow-400 hover:text-yellow-300' 
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{item.name}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-medium">${item.price.toFixed(2)}</p>
                      <div className={`flex items-center text-sm ${
                        item.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromWatchlist(item.symbol)}
                      className="ml-4 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  
                  {item.alert && (
                    <div className="mt-2 text-xs text-gray-400">
                      Alert: {item.alert.type} ${item.alert.price.toFixed(2)}
                      {item.alert.enabled ? ' (Active)' : ' (Inactive)'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Symbols */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Add Symbols</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAssets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-white">{asset.symbol}</div>
                  <div className="text-sm text-gray-400">{asset.name}</div>
                </div>
                <div className="text-right mr-3">
                  <div className="text-white font-medium">${asset.price.toFixed(2)}</div>
                  <div className={`text-sm ${
                    asset.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                  </div>
                </div>
                <button
                  onClick={() => addToWatchlist(asset)}
                  disabled={watchlist.some(item => item.symbol === asset.symbol)}
                  className="p-2 text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;