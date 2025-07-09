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
        await loadUserData(session.user.id, session.user.email || '');
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user && event !== 'SIGNED_UP') {
          await loadUserData(session.user.id, session.user.email || '');
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

  const loadUserData = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await authHelpers.getProfile(userId);
      
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        // Use the actual email from profile (can be null for contact-only users)
        const userEmail = profile.email || '';
        
        const authUserData: AuthUser = {
          id: profile.id,
          email: userEmail,
          full_name: profile.full_name || '',
          contact_number: profile.contact_number || '',
          avatar_url: profile.avatar_url || undefined,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };

        const userData: User = {
          id: profile.id,
          name: profile.full_name || 'User',
          email: userEmail,
          full_name: profile.full_name || undefined,
          contact_number: profile.contact_number || undefined,
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
      await loadUserData(authUser.id, authUser.email);
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