import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSessionStore } from '../store';
import { Loader2 } from 'lucide-react';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuth } = useSessionStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand w-8 h-8" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/room" replace /> : <Outlet />;
};
