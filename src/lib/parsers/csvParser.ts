// Robust CSV Statement Parser for Indian Bank Statement Exports
import { BankName, PaymentChannel, TransactionType } from '../types';

export interface ParsedCSVRow {
  date: string;
  amount: number;
  type: TransactionType;
  cleanPayee: string;
  bank: BankName;
  channel: PaymentChannel;
  rawText: string;
  isP2P: boolean;
}

export function parseCSVStatement(csvContent: string): ParsedCSVRow[] {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  
  // Find indices for common column names
  const dateIdx = headers.findIndex(h => /date|txn\s*date|transaction\s*date/i.test(h));
  const descIdx = headers.findIndex(h => /narration|description|particulars|remarks|details/i.test(h));
  const debitIdx = headers.findIndex(h => /debit|withdrawal|dr/i.test(h));
  const creditIdx = headers.findIndex(h => /credit|deposit|cr/i.test(h));
  const amountIdx = headers.findIndex(h => /^amount$/i.test(h));
  const typeIdx = headers.findIndex(h => /type|dr\/cr/i.test(h));

  const results: ParsedCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Handle quoted commas properly
    const cols = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
    const cleanCols = cols.map(c => c.replace(/^["']|["']$/g, '').trim());

    if (cleanCols.length < 3) continue;

    // Date
    let dateStr = dateIdx !== -1 && cleanCols[dateIdx] ? cleanCols[dateIdx] : new Date().toISOString().split('T')[0];
    dateStr = normalizeDate(dateStr);

    // Description / Payee
    const rawDesc = descIdx !== -1 && cleanCols[descIdx] ? cleanCols[descIdx] : 'Bank Transfer';
    
    // Amount & Type
    let amount = 0;
    let type: TransactionType = 'debit';

    if (debitIdx !== -1 && creditIdx !== -1) {
      const debitVal = parseFloat(cleanCols[debitIdx]?.replace(/,/g, '') || '0');
      const creditVal = parseFloat(cleanCols[creditIdx]?.replace(/,/g, '') || '0');
      if (debitVal > 0) {
        amount = debitVal;
        type = 'debit';
      } else if (creditVal > 0) {
        amount = creditVal;
        type = 'credit';
      }
    } else if (amountIdx !== -1) {
      amount = Math.abs(parseFloat(cleanCols[amountIdx]?.replace(/,/g, '') || '0'));
      if (typeIdx !== -1) {
        type = /cr|credit|deposit/i.test(cleanCols[typeIdx]) ? 'credit' : 'debit';
      }
    }

    if (amount <= 0 || isNaN(amount)) continue;

    // Channel and Payee Extraction
    let channel: PaymentChannel = 'CARD';
    if (/UPI/i.test(rawDesc)) channel = 'UPI';
    else if (/NEFT|IMPS|RTGS/i.test(rawDesc)) channel = 'NETBANKING';
    else if (/POS|CARD|VISA|MASTERCARD/i.test(rawDesc)) channel = 'CARD';

    const cleanPayee = extractPayeeFromNarration(rawDesc);
    const isP2P = channel === 'UPI' && !/swiggy|zomato|uber|ola|blinkit|zepto|amazon|flipkart/i.test(cleanPayee);

    results.push({
      date: dateStr,
      amount,
      type,
      cleanPayee,
      bank: 'HDFC', // Default export source or infer from header
      channel,
      rawText: rawDesc,
      isP2P
    });
  }

  return results;
}

function normalizeDate(raw: string): string {
  const parts = raw.match(/(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})/);
  if (!parts) return new Date().toISOString().split('T')[0];
  let year = parts[3];
  let month = parts[2].padStart(2, '0');
  let day = parts[1].padStart(2, '0');
  if (parts[1].length === 4) {
    year = parts[1];
    day = parts[3].padStart(2, '0');
  } else if (year.length === 2) {
    year = `20${year}`;
  }
  return `${year}-${month}-${day}`;
}

function extractPayeeFromNarration(narration: string): string {
  // UPI format: UPI-PAYEE NAME-VPA-BANK
  const upiMatch = narration.match(/UPI[-/]([^/-]+)/i);
  if (upiMatch && upiMatch[1]) {
    return upiMatch[1].trim();
  }
  // POS format: POS 410291 MERCHANT NAME
  const posMatch = narration.match(/POS\s*\d*\s*([A-Za-z\s]+)/i);
  if (posMatch && posMatch[1]) {
    return posMatch[1].trim();
  }
  // Default first 3 words
  return narration.split(/[-/]/)[0].trim().slice(0, 30) || 'Bank Narration';
}
