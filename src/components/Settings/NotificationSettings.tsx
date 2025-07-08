import React from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { UserSettings } from '../../types';

interface NotificationSettingsProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onUpdate }) => {
  const handleToggle = (key: keyof UserSettings, value: boolean) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Notification Preferences</h2>
        <p className="text-gray-400">Choose how you want to be notified about account activity.</p>
      </div>

      <div className="space-y-4">
        {/* General Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">Push Notifications</h3>
              <p className="text-gray-400 text-sm">Receive notifications in your browser</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) => handleToggle('notifications_enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-green-400" />
            <div>
              <h3 className="text-white font-medium">Email Notifications</h3>
              <p className="text-gray-400 text-sm">Get updates via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => handleToggle('email_notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="text-white font-medium">SMS Notifications</h3>
              <p className="text-gray-400 text-sm">Receive text messages for important updates</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sms_notifications}
              onChange={(e) => handleToggle('sms_notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">Notification Types</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Daily investment gains</li>
          <li>• Account balance updates</li>
          <li>• Security alerts</li>
          <li>• System maintenance notices</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationSettings;