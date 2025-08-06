'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const AuthInitializer: React.FC = () => {
  const { initializeAuth, isInitialized } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isInitialized) {
      // Initialize auth on app startup
      initializeAuth();
    }
  }, [isMounted, isInitialized, initializeAuth]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
