export interface User {
  id: string;
  name: string;
  email: string;
  full_name?: string;
  contact_number?: string;
  avatar_url?: string;
  accountValue: number;
  availableBalance: number;
  dayGainLoss: number;
  totalGainLoss: number;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  contact_number: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  contactNumber: string;
  agreeToTerms: boolean;
}

export interface InvestmentPlan {
  id: string;
  user_id: string;
  plan_type: '2000' | '5000' | '10000' | '20000';
  initial_amount: number;
  daily_increment: number;
  current_balance: number;
  total_gained: number;
  start_date: string;
  last_increment_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  language: string;
  currency: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyGain {
  id: string;
  user_id: string;
  investment_plan_id: string;
  gain_amount: number;
  balance_before: number;
  balance_after: number;
  gain_date: string;
  created_at: string;
}

export interface PlanOption {
  type: '2000' | '5000' | '10000' | '20000';
  amount: number;
  dailyGain: number;
  title: string;
  description: string;
  popular?: boolean;
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52Week: number;
  low52Week: number;
  peRatio: number;
  dividend: number;
  beta: number;
}

export interface Portfolio {
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  allocation: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop' | 'stop-limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: 'day' | 'gtc' | 'ioc' | 'fok';
  status: 'open' | 'filled' | 'cancelled' | 'rejected';
  createdAt: Date;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  alert?: {
    type: 'above' | 'below';
    price: number;
    enabled: boolean;
  };
}

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'volume' | 'news';
  condition: 'above' | 'below' | 'equals';
  value: number;
  message: string;
  isActive: boolean;
  createdAt: Date;
}