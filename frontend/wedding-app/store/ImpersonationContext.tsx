import React, { createContext, useContext, useState } from 'react';
import type { AuthUser } from '../types/api';

interface ImpersonationContextValue {
  adminUser: AuthUser | null;
  saveAdmin: (user: AuthUser) => void;
  clearAdmin: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextValue | null>(null);

export function ImpersonationProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);

  return (
    <ImpersonationContext.Provider value={{
      adminUser,
      saveAdmin: setAdminUser,
      clearAdmin: () => setAdminUser(null),
    }}>
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  const ctx = useContext(ImpersonationContext);
  if (!ctx) throw new Error('useImpersonation must be used within ImpersonationProvider');
  return ctx;
}
