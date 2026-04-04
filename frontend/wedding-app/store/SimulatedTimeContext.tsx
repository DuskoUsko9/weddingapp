import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initSimulatedTime,
  getSimulatedTime,
  saveSimulatedTime,
  clearSimulatedTime,
} from './simulatedTime';

interface SimulatedTimeContextValue {
  simulatedTime: string | null;
  setSimulatedTime: (isoUtc: string | null) => void;
}

const SimulatedTimeContext = createContext<SimulatedTimeContextValue | null>(null);

export function SimulatedTimeProvider({ children }: { children: React.ReactNode }) {
  const [simulatedTime, setSimulatedTimeState] = useState<string | null>(null);

  useEffect(() => {
    initSimulatedTime();
    setSimulatedTimeState(getSimulatedTime());
  }, []);

  const setSimulatedTime = (isoUtc: string | null) => {
    if (isoUtc) {
      saveSimulatedTime(isoUtc);
    } else {
      clearSimulatedTime();
    }
    setSimulatedTimeState(isoUtc);
  };

  return (
    <SimulatedTimeContext.Provider value={{ simulatedTime, setSimulatedTime }}>
      {children}
    </SimulatedTimeContext.Provider>
  );
}

export function useSimulatedTime() {
  const ctx = useContext(SimulatedTimeContext);
  if (!ctx) throw new Error('useSimulatedTime must be used within SimulatedTimeProvider');
  return ctx;
}
