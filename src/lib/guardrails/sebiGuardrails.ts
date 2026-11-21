// SEBI-Compliant Financial Advisory Guardrail Filter & Classifier
import { GuardrailCheckResult } from '../types';

// Blacklist of Stock Market Tickers, Stock Names & Advisory Patterns
const BLOCKED_SECURITIES_PATTERN = /\b(?:hdfc\s*bank|reliance|tcs|infosys|tata\s*motors|zomato\s*share|suzlon|ireda|adani\s*enterprises|nifty\s*call|nifty\s*put|banknifty|options\s*buying|future\s*and\s*options|f&o|penny\s*stocks|crypto|bitcoin|eth)\b/i;

const BLOCKED_BUY_SELL_CALLS = /\b(?:buy\s+now|sell\s+now|target\s+price|stop\s*loss|multibagger|guaranteed\s*returns?|assured\s*returns?|double\s*your\s*money|fixed\s*20%|100%\s*safe\s*investment)\b/i;

export function evaluateSEBIGuardrails(userInput: string, aiDraftResponse?: string): GuardrailCheckResult {
  const combined = `${userInput} ${aiDraftResponse || ''}`;

  // 1. Check for specific named stock queries or buy/sell calls
  if (BLOCKED_BUY_SELL_CALLS.test(combined)) {
    return {
      isCompliant: false,
      action: 'BLOCKED_GUARANTEED_RETURN',
      reason: 'SEBI Compliance Violation: Claims of guaranteed investment returns or specific buy/sell trading signals are strictly prohibited.',
      educationalAlternative: 'Market investments carry risk and cannot guarantee fixed returns. Would you like to review risk-free debt instruments (such as RBI Treasury Bills or Fixed Deposits) or learn how a diversified index fund SIP reduces volatility over 5+ years?',
      aiAssistedLabel: true
    };
  }

  if (BLOCKED_SECURITIES_PATTERN.test(combined)) {
    return {
      isCompliant: false,
      action: 'BLOCKED_SPECIFIC_STOCK',
      reason: 'SEBI Compliance Restriction: ArthaMind is an educational personal finance coach and cannot provide advice, buy/sell recommendations, or price targets on individual listed securities.',
      educationalAlternative: 'Instead of individual stock picks, we can model how allocating ₹5,000/month into broad market index funds (e.g. Nifty 50) compares with building your emergency cushion or paying down high-interest debt.',
      aiAssistedLabel: true
    };
  }

  // 2. Query is educational or modeling focused
  return {
    isCompliant: true,
    action: 'PASSED',
    aiAssistedLabel: true
  };
}
