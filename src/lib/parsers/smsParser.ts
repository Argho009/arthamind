// High-precision Indian Bank SMS & UPI Parser
import { Transaction, BankName, PaymentChannel, TransactionType } from '../types';

export interface ParsedSMSResult {
  amount: number;
  type: TransactionType;
  cleanPayee: string;
  bank: BankName;
  channel: PaymentChannel;
  upiRef?: string;
  date: string;
  rawText: string;
  isP2P: boolean;
}

export function parseBankSMS(smsText: string): ParsedSMSResult | null {
  const clean = smsText.trim();
  if (!clean) return null;

  // 1. Detect Amount (Handles Rs., Rs, INR, ₹ with commas and decimals)
  const amountRegex = /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
  const amountMatch = clean.match(amountRegex);
  if (!amountMatch) return null;
  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  if (isNaN(amount) || amount <= 0) return null;

  // 2. Detect Debit vs Credit
  let type: TransactionType = 'debit';
  if (
    /credited|received|deposited|refund|cashback|CR\b/i.test(clean) &&
    !/credited for debit|failed/i.test(clean)
  ) {
    type = 'credit';
  } else if (/debited|sent|spent|paid|withdrawn|transferred to|DR\b/i.test(clean)) {
    type = 'debit';
  }

  // 3. Detect Bank
  let bank: BankName = 'OTHER';
  if (/HDFC/i.test(clean)) bank = 'HDFC';
  else if (/ICICI/i.test(clean)) bank = 'ICICI';
  else if (/SBI|State Bank/i.test(clean)) bank = 'SBI';
  else if (/Axis/i.test(clean)) bank = 'AXIS';
  else if (/Kotak/i.test(clean)) bank = 'KOTAK';
  else if (/Paytm/i.test(clean)) bank = 'PAYTM';

  // 4. Detect Channel
  let channel: PaymentChannel = 'CARD';
  if (/UPI|VPA|BHIM|GPay|PhonePe/i.test(clean)) {
    channel = 'UPI';
  } else if (/Card\s*(?:ending|\*\*|xx)?\s*\d{4}/i.test(clean)) {
    channel = 'CARD';
  } else if (/NEFT|IMPS|RTGS|NetBanking/i.test(clean)) {
    channel = 'NETBANKING';
  }

  // 5. Extract Payee Name and Disambiguate P2P
  let cleanPayee = 'Unknown Payee';
  let isP2P = false;

  // Pattern: "Sent Rs.X to <Name> UPI Ref"
  const sentToMatch = clean.match(/(?:sent|paid|transferred)\s+(?:Rs\.?|INR|₹)?\s*[\d,.]*\s*(?:to|at)\s+([^.]+?)(?:\s+(?:UPI|on|Ref|via|from|a\/c|using|dated|\.))/i);
  // Pattern: "Paid Rs.X at <Merchant>"
  const paidAtMatch = clean.match(/(?:paid|spent)\s+(?:Rs\.?|INR|₹)?\s*[\d,.]*\s+at\s+([^.]+?)(?:\s+(?:on|using|card|ref|\.))/i);
  // Pattern: "credited from <Name>" or "received from <Name>"
  const receivedFromMatch = clean.match(/(?:received|credited)\s+(?:Rs\.?|INR|₹)?\s*[\d,.]*\s*(?:from|by)\s+([^.]+?)(?:\s+(?:UPI|Ref|via|on|NEFT|IMPS|\.))/i);
  // Pattern: UPI string format like "UPI/P2M/CR/Karan Verma/Toit share/HDFC"
  const upiDelimitedMatch = clean.match(/UPI\/(?:P2P|P2M)\/(?:CR|DR)\/([^/]+)/i);

  if (upiDelimitedMatch) {
    cleanPayee = upiDelimitedMatch[1].trim();
  } else if (sentToMatch && sentToMatch[1]) {
    cleanPayee = sentToMatch[1].trim();
  } else if (paidAtMatch && paidAtMatch[1]) {
    cleanPayee = paidAtMatch[1].trim();
  } else if (receivedFromMatch && receivedFromMatch[1]) {
    cleanPayee = receivedFromMatch[1].trim();
  }

  // Clean noise words
  cleanPayee = cleanPayee
    .replace(/(?:vpa|ref|upi|acc|ac|ltd|pvt|co|bank|card)\s*$/i, '')
    .replace(/^[-\s,]+|[-\s,]+$/g, '')
    .trim();

  if (!cleanPayee) cleanPayee = 'Merchant Payment';

  // Flag P2P (Typical Indian names vs Known Merchants)
  const isKnownMerchant = /swiggy|zomato|uber|ola|blinkit|zepto|amazon|flipkart|netflix|spotify|cult|airtel|jio|bsnl|tatapower|bescom|toit|starbucks|mcdonalds|dmart/i.test(cleanPayee);
  if (channel === 'UPI' && !isKnownMerchant) {
    // If it has spaces like a person's name or explicit P2P indicator
    if (/\s/.test(cleanPayee) || /P2P/i.test(clean)) {
      isP2P = true;
    }
  }

  // Extract UPI Ref if present
  const upiRefMatch = clean.match(/(?:UPI Ref|Ref no|Ref|rrn)[:\s]*([a-zA-Z0-9]+)/i);
  const upiRef = upiRefMatch ? upiRefMatch[1] : undefined;

  // Extract Date or use Today
  const dateMatch = clean.match(/(\d{2})[-/](\d{2})[-/](\d{2,4})/);
  let date = new Date().toISOString().split('T')[0];
  if (dateMatch) {
    const day = dateMatch[1];
    const month = dateMatch[2];
    const year = dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3];
    date = `${year}-${month}-${day}`;
  }

  return {
    amount,
    type,
    cleanPayee,
    bank,
    channel,
    upiRef,
    date,
    rawText: clean,
    isP2P
  };
}
