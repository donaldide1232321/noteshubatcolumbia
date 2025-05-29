import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  username: string;
  hasUploaded: boolean;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  updateUserUploadStatus: () => void;
  getUploadCount: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a default user with hasUploaded set to true
  const defaultUser: User = {
    id: 'default-user',
    email: 'user@columbia.edu',
    username: 'Columbia Student',
    hasUploaded: true
  };

  const [user] = useState<User>(defaultUser);
  const [isAuthenticated] = useState(true);

  const updateUserUploadStatus = async () => {
    try {
      // Update the upload count in app_stats
      await supabase.rpc('increment_upload_count');
    } catch (error) {
      console.error('Error updating upload count:', error);
    }
  };

  const getUploadCount = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('id', { count: 'exact' });

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Error getting upload count:', error);
      return 0;
    }
  };

  const value = {
    user,
    isAuthenticated,
    updateUserUploadStatus,
    getUploadCount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
