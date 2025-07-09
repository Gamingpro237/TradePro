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
  signUp: async (email: string, password: string, fullName: string, contactNumber: string) => {
    // Always use contact number for Supabase auth to ensure consistency
    const authEmail = `${contactNumber.replace(/[^0-9]/g, '')}@trade-pro.com`;
    
    try {
      // First, sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            full_name: fullName,
            contact_number: contactNumber,
            user_email: email, // Store actual email in metadata
          },
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { data: null, error: authError };
      }

      // If user was created successfully, ensure profile is created
      if (authData.user) {
        // Wait a moment for the trigger to fire
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create or update profile with actual email
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: authData.user.id,
            full_name: fullName,
            contact_number: contactNumber,
            email: authEmail, // Store the synthetic email to match auth
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { data: null, error: profileError };
        }
        // Create default settings
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: authData.user.id,
          });

        if (settingsError) {
          console.error('Settings creation error:', settingsError);
          return { data: null, error: settingsError };
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Signup process error:', error);
      return { data: null, error };
    }
  },

  signIn: async (contactNumber: string, password: string) => {
    try {
      // Construct the login email using the same format as registration
      const loginEmail = `${contactNumber.replace(/[^0-9]/g, '')}@trade-pro.com`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        return { 
          data: null, 
          error: { message: 'Invalid contact number or password. Please check your credentials.' }
        };
      }

      return { data, error };
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

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Debug function to check user data
  debugUserData: async (contactNumber: string) => {
    console.log('=== DEBUG USER DATA ===');
    
    // Check user_profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('contact_number', contactNumber);
    
    console.log('Profiles found:', profiles);
    console.log('Profile error:', profileError);
    
    // Check auth.users table (this requires service role, so it might not work)
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    console.log('Auth users:', users);
    console.log('Users error:', usersError);
    
    return { profiles, profileError, users, usersError };
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