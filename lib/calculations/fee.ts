// Fee calculation utilities based on idea.md specifications

const FEE_PERCENTAGE = 0.20; // 20% of total debt
const MIN_FEE = 500;
const MAX_FEE = 5000;

export interface FeeCalculation {
  totalDebt: number;
  feePercentage: number;
  calculatedFee: number;
  finalFee: number;
  minCapped: boolean;
  maxCapped: boolean;
}

export function calculateFee(totalDebt: number): FeeCalculation {
  const calculatedFee = totalDebt * FEE_PERCENTAGE;
  let finalFee = calculatedFee;
  let minCapped = false;
  let maxCapped = false;
  
  if (calculatedFee < MIN_FEE) {
    finalFee = MIN_FEE;
    minCapped = true;
  } else if (calculatedFee > MAX_FEE) {
    finalFee = MAX_FEE;
    maxCapped = true;
  }
  
  return {
    totalDebt,
    feePercentage: FEE_PERCENTAGE,
    calculatedFee,
    finalFee: Math.round(finalFee), // Round to nearest pound
    minCapped,
    maxCapped,
  };
}

export interface PaymentPlanOption {
  duration: number; // months
  monthlyAmount: number;
  totalAmount: number;
  label: string;
}

export function calculatePaymentOptions(fee: number): PaymentPlanOption[] {
  const durations = [12, 24, 36, 48, 60];
  
  return durations.map(duration => ({
    duration,
    monthlyAmount: Math.ceil(fee / duration),
    totalAmount: fee,
    label: duration === 12 ? 'Standard' : duration === 60 ? 'Extended' : `${duration} months`,
  }));
}

export interface AffordabilityCheck {
  monthlyDisposableIncome: number;
  affordabilityCap: number;
  maxAffordableMonthly: number;
  minimumDuration: number;
  isAffordable: boolean;
  reason?: string;
}

export function checkAffordability(
  income: number,
  essentials: number,
  fee: number,
  factor: number = 0.6
): AffordabilityCheck {
  const monthlyDisposableIncome = income - essentials;
  const affordabilityCap = Math.floor(monthlyDisposableIncome * factor);
  const standardMonthly = Math.ceil(fee / 12);
  const maxAffordableMonthly = Math.min(standardMonthly, affordabilityCap);
  
  // Find minimum duration needed
  let minimumDuration = 12;
  let isAffordable = false;
  let reason: string | undefined;
  
  for (let duration = 12; duration <= 60; duration++) {
    const monthlyRequired = Math.ceil(fee / duration);
    if (monthlyRequired <= affordabilityCap) {
      minimumDuration = duration;
      isAffordable = true;
      break;
    }
  }
  
  if (!isAffordable) {
    reason = 'Cannot afford payments within 60 months';
  }
  
  return {
    monthlyDisposableIncome,
    affordabilityCap,
    maxAffordableMonthly,
    minimumDuration,
    isAffordable,
    reason,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

