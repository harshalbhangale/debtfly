import type { OnboardingData } from '../mock-data/types';

const ONBOARDING_KEY = 'debtfly_onboarding';
const ONBOARDING_COMPLETE_KEY = 'debtfly_onboarding_complete';

export function saveOnboardingStep<K extends keyof OnboardingData>(
  step: K,
  data: OnboardingData[K]
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getOnboardingData();
    const updated = { ...existing, [step]: data };
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving onboarding step:', error);
  }
}

export function getOnboardingData(): OnboardingData {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(ONBOARDING_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading onboarding data:', error);
    return {};
  }
}

export function getOnboardingStep<K extends keyof OnboardingData>(
  step: K
): OnboardingData[K] | undefined {
  const data = getOnboardingData();
  return data[step];
}

export function clearOnboardingData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
  } catch (error) {
    console.error('Error clearing onboarding data:', error);
  }
}

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export function markOnboardingComplete(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  } catch (error) {
    console.error('Error marking onboarding complete:', error);
  }
}

export function getCurrentOnboardingStep(): string {
  if (typeof window === 'undefined') return 'qualifying';
  
  const data = getOnboardingData();
  
  if (!data.qualifying) return 'qualifying';
  if (!data.identity) return 'identity';
  if (!data.signature) return 'signature';
  if (!data.debts) return 'debts';
  if (data.debts && data.debts.length === 0) return 'debts/display';
  if (!data.plan) return 'plan';
  if (!data.payment) return 'payment';
  
  return 'complete';
}

