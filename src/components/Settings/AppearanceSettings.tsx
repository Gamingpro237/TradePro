import React from 'react';
import { Palette, Monitor, Sun, Moon, Globe, DollarSign } from 'lucide-react';
import { UserSettings } from '../../types';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ settings, onUpdate }) => {
  const themes = [
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Dark theme for better focus' },
    { id: 'light', name: 'Light', icon: Sun, description: 'Light theme for daytime use' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Appearance & Localization</h2>
        <p className="text-gray-400">Customize how the application looks and behaves.</p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-white font-medium flex items-center">
          <Palette className="w-4 h-4 mr-2 text-blue-400" />
          Theme
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => onUpdate({ theme: theme.id as 'light' | 'dark' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  settings.theme === theme.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-300" />
                  <div className="text-left">
                    <div className="text-white font-medium">{theme.name}</div>
                    <div className="text-gray-400 text-sm">{theme.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-3">
        <h3 className="text-white font-medium flex items-center">
          <Globe className="w-4 h-4 mr-2 text-green-400" />
          Language
        </h3>
        <select
          value={settings.language}
          onChange={(e) => onUpdate({ language: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Currency Selection */}
      <div className="space-y-3">
        <h3 className="text-white font-medium flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-yellow-400" />
          Currency
        </h3>
        <select
          value={settings.currency}
          onChange={(e) => onUpdate({ currency: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name} ({currency.code})
            </option>
          ))}
        </select>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-700 rounded-lg">
        <h4 className="text-white font-medium mb-3">Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Theme:</span>
            <span className="text-white capitalize">{settings.theme}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Language:</span>
            <span className="text-white">
              {languages.find(l => l.code === settings.language)?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Currency:</span>
            <span className="text-white">
              {currencies.find(c => c.code === settings.currency)?.symbol} {settings.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;