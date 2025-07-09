import { useState, useEffect } from 'react';
import { User, AuthUser } from '../types';
import { supabase, authHelpers } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserData(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user && event !== 'SIGNED_UP') {
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setAuthUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: profile, error: profileError } = await authHelpers.getProfile(userId);
      
      if (profileError) {
        console.error('Error loading profile:', profileError);
        return;
      }

      // Load user account
      const { data: account, error: accountError } = await authHelpers.getUserAccount(userId);
      
      if (accountError) {
        console.error('Error loading account:', accountError);
        return;
      }

      if (profile && account) {
        const authUserData: AuthUser = {
          id: profile.id,
          email: profile.email || account.email || '',
          username: account.username,
          full_name: account.full_name,
          contact_number: account.contact_number,
          avatar_url: profile.avatar_url || undefined,
          created_at: account.created_at,
          updated_at: account.updated_at,
        };

        const userData: User = {
          id: profile.id,
          name: account.full_name || account.username,
          email: profile.email || account.email || '',
          username: account.username,
          full_name: account.full_name,
          contact_number: account.contact_number,
          avatar_url: profile.avatar_url || undefined,
          accountValue: 125480.75, // Mock data - replace with real data
          availableBalance: 15420.50,
          dayGainLoss: 1250.30,
          totalGainLoss: 18420.75,
        };

        setAuthUser(authUserData);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const logout = async () => {
    const { error } = await authHelpers.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return;
    }
    setUser(null);
    setAuthUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updates: { full_name?: string; contact_number?: string; avatar_url?: string }) => {
    if (!authUser) return { error: 'No user logged in' };

    const { data, error } = await authHelpers.updateProfile(authUser.id, updates);
    
    if (!error && data) {
      await loadUserData(authUser.id);
    }
    
    return { data, error };
  };

  return {
    user,
    authUser,
    isAuthenticated,
    loading,
    logout,
    updateProfile,
  };
};