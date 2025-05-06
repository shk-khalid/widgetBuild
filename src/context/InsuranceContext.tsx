import { createContext, useContext } from 'react';

interface InsuranceContextType {
  hasInsurance: boolean;
  selectedPlan: string | null;
  setSelectedPlan: (plan: string | null) => void;
  setHasInsurance: (hasInsurance: boolean) => void;
}

export const InsuranceContext = createContext<InsuranceContextType>({
  hasInsurance: false,
  selectedPlan: null,
  setSelectedPlan: () => {},
  setHasInsurance: () => {},
});

export const useInsurance = () => useContext(InsuranceContext);