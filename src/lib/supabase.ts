import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  full_name: string | null;
  contact_number: string | null;
  avatar_url: string | null;
  email: string | null;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserAccount {
  id: string;
  auth_user_id: string;
  username: string;
  contact_number: string;
  email: string | null;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvestmentPlanDB {
  id: string;
  user_id: string;
  plan_type: string;
  initial_amount: number;
  daily_increment: number;
  current_balance: number;
  total_gained: number;
  start_date: string;
  last_increment_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsDB {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  currency: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Auth helper functions
export const authHelpers = {
  signUp: async (email: string, password: string, fullName: string, contactNumber: string, username: string) => {
    try {
      // Check if username already exists
      const { data: usernameExists, error: usernameError } = await supabase
        .rpc('check_username_exists', { check_username: username });
      
      if (usernameError) {
        return { data: null, error: { message: 'Error checking username availability' } };
      }
      
      if (usernameExists) {
        return { data: null, error: { message: 'Username already exists. Please choose a different username.' } };
      }

      // Check if contact number already exists
      const { data: contactExists, error: contactError } = await supabase
        .rpc('check_contact_exists', { check_contact: contactNumber });
      
      if (contactError) {
        return { data: null, error: { message: 'Error checking contact number availability' } };
      }
      
      if (contactExists) {
        return { data: null, error: { message: 'Contact number already registered. Please use a different contact number or sign in.' } };
      }

      // Check if email already exists (if provided)
      if (email) {
        const { data: emailExists, error: emailError } = await supabase
          .rpc('check_email_exists', { check_email: email });
        
        if (emailError) {
          return { data: null, error: { message: 'Error checking email availability' } };
        }
        
        if (emailExists) {
          return { data: null, error: { message: 'Email already registered. Please use a different email or sign in.' } };
        }
      }

      // Generate a unique auth email for Supabase (since email is optional for users)
      const authEmail = email || `${username}_${Date.now()}@tradepro.internal`;
      
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            username,
            full_name: fullName,
            contact_number: contactNumber,
            email: email || null, // Store actual email (can be null)
          },
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { data: null, error: authError };
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Signup process error:', error);
      return { data: null, error: { message: 'Registration failed. Please try again.' } };
    }
  },

  signIn: async (loginIdentifier: string, password: string) => {
    try {
      // Find user by username, email, or contact number
      const { data: userLookup, error: lookupError } = await supabase
        .rpc('find_user_for_login', { login_identifier: loginIdentifier });
      
      if (lookupError) {
        console.error('User lookup error:', lookupError);
        return { 
          data: null, 
          error: { message: 'Error during sign in. Please try again.' }
        };
      }

      if (!userLookup || userLookup.length === 0) {
        return { 
          data: null, 
          error: { message: 'No account found with this username, email, or contact number.' }
        };
      }

      const authEmail = userLookup[0].auth_email;
      
      // Sign in with the auth email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { 
            data: null, 
            error: { message: 'Invalid password. Please check your password and try again.' }
          };
        }
        return { 
          data: null, 
          error: { message: error.message || 'Sign in failed. Please try again.' }
        };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        data: null, 
        error: { message: 'An error occurred during sign in. Please try again.' }
      };
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  getProfile: async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  getUserAccount: async (userId: string): Promise<{ data: UserAccount | null; error: any }> => {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('auth_user_id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  updateAccount: async (userId: string, updates: Partial<UserAccount>) => {
    const { data, error } = await supabase
      .from('user_accounts')
      .update(updates)
      .eq('auth_user_id', userId)
      .select()
      .single();
    return { data, error };
  },
};

// Investment plan helpers
export const investmentHelpers = {
  createPlan: async (userId: string, planType: string, initialAmount: number) => {
    const dailyIncrements = {
      '2000': 60,
      '5000': 160,
      '10000': 330,
      '20000': 660,
    };

    const { data, error } = await supabase
      .from('investment_plans')
      .insert({
        user_id: userId,
        plan_type: planType,
        initial_amount: initialAmount,
        daily_increment: dailyIncrements[planType as keyof typeof dailyIncrements],
        current_balance: initialAmount,
      })
      .select()
      .single();

    return { data, error };
  },

  getUserPlans: async (userId: string) => {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  updatePlan: async (planId: string, updates: Partial<InvestmentPlanDB>) => {
    const { data, error } = await supabase
      .from('investment_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();

    return { data, error };
  },

  getDailyGains: async (userId: string, limit = 30) => {
    const { data, error } = await supabase
      .from('daily_gains')
      .select(`
        *,
        investment_plans(plan_type, initial_amount)
      `)
      .eq('user_id', userId)
      .order('gain_date', { ascending: false })
      .limit(limit);

    return { data, error };
  },
};

// Settings helpers
export const settingsHelpers = {
  getUserSettings: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  },

  updateSettings: async (userId: string, updates: Partial<UserSettingsDB>) => {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    return { data, error };
  },
};