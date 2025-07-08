import React from 'react';
import { User, LogOut, Settings, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-white">TradePro</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-6 text-sm">
            <div className="text-gray-300">
              Account Value: 
              <span className="text-white font-semibold ml-1">
                ${user?.accountValue.toLocaleString()}
              </span>
            </div>
            <div className="text-gray-300">
              Day P&L: 
              <span className={`font-semibold ml-1 ${
                (user?.dayGainLoss || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${user?.dayGainLoss.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-gray-700">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-300" />
                )}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-white">{user?.name}</div>
                {user?.contact_number && (
                  <div className="text-xs text-gray-400">{user.contact_number}</div>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;