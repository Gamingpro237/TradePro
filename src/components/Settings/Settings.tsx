import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { settingsHelpers } from '../../lib/supabase';
import { UserSettings } from '../../types';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import AppearanceSettings from './AppearanceSettings';

const Settings: React.FC = () => {
  const { authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      loadSettings();
    }
  }, [authUser]);

  const loadSettings = async () => {
    if (!authUser) return;

    try {
      const { data, error } = await settingsHelpers.getUserSettings(authUser.id);
      if (error) {
        console.error('Error loading settings:', error);
        return;
      }
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!authUser || !settings) return;

    try {
      const { data, error } = await settingsHelpers.updateSettings(authUser.id, updates);
      if (error) {
        console.error('Error updating settings:', error);
        return;
      }
      setSettings(data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (!settings) return null;

    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings settings={settings} onUpdate={updateSettings} />;
      case 'security':
        return <SecuritySettings settings={settings} onUpdate={updateSettings} />;
      case 'appearance':
        return <AppearanceSettings settings={settings} onUpdate={updateSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <SettingsIcon className="w-6 h-6 mr-2 text-blue-400" />
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;