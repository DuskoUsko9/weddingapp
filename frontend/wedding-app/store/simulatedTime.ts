const SIM_TIME_KEY = 'madu_sim_time';

// Module-level cache — synchronously accessible by the API interceptor
let _cachedSimTime: string | null = null;

export function initSimulatedTime(): void {
  if (typeof window !== 'undefined') {
    _cachedSimTime = localStorage.getItem(SIM_TIME_KEY);
  }
}

export function getSimulatedTime(): string | null {
  return _cachedSimTime;
}

export function saveSimulatedTime(isoUtc: string): void {
  _cachedSimTime = isoUtc;
  if (typeof window !== 'undefined') {
    localStorage.setItem(SIM_TIME_KEY, isoUtc);
  }
}

export function clearSimulatedTime(): void {
  _cachedSimTime = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SIM_TIME_KEY);
  }
}
