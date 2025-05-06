
/**
 * Utility functions to extract structured data from OCR text
 */

export interface ExtractedClaimData {
  invoiceNumber?: string;
  date?: string;
  customerName?: string;
  productName?: string;
  amount?: string;
  [key: string]: string | undefined;
}

/**
 * Extract structured data from OCR text using keyword matching
 */
export function extractClaimDataFromOCR(ocrText: string): ExtractedClaimData {
  if (!ocrText) return {};
  
  const normalizedText = ocrText.replace(/\n/g, ' ').toLowerCase();
  const extractedData: ExtractedClaimData = {};
  
  // Extract invoice number
  const invoiceMatches = ocrText.match(/inv(oice)?\s*(no|number|#)?[:.\s]*\s*([A-Z0-9-]+)/i) || 
                         ocrText.match(/(bill|receipt)\s*(no|number|#)?[:.\s]*\s*([A-Z0-9-]+)/i);
  if (invoiceMatches && invoiceMatches[3]) {
    extractedData.invoiceNumber = invoiceMatches[3].trim();
  }
  
  // Extract date
  const dateMatches = ocrText.match(/date[:.\s]*\s*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i) ||
                      ocrText.match(/([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/);
  if (dateMatches && dateMatches[1]) {
    extractedData.date = dateMatches[1].trim();
  }
  
  // Extract customer name
  const nameMatches = ocrText.match(/((mr|ms|mrs|miss|dr)\.?\s+[a-z]+(\s+[a-z]+)?)/i) ||
                      ocrText.match(/customer[:.\s]*\s*([a-z]+(\s+[a-z]+)?)/i) ||
                      ocrText.match(/bill to[:.\s]*\s*([a-z]+(\s+[a-z]+)+)/i);
  if (nameMatches && (nameMatches[1] || nameMatches[2])) {
    extractedData.customerName = (nameMatches[1] || nameMatches[2]).trim();
  }
  
  // Extract product name
  const productMatches = ocrText.match(/item[:.\s]*\s*([a-z0-9\s]+)/i) ||
                         ocrText.match(/product[:.\s]*\s*([a-z0-9\s]+)/i) ||
                         ocrText.match(/description[:.\s]*\s*([a-z0-9\s]+)/i);
  if (productMatches && productMatches[1]) {
    extractedData.productName = productMatches[1].trim();
  }
  
  // Extract amount/price
  const amountMatches = ocrText.match(/amount[:.\s]*\s*(\$?[0-9]+\.[0-9]{2})/i) ||
                        ocrText.match(/total[:.\s]*\s*(\$?[0-9]+\.[0-9]{2})/i) ||
                        ocrText.match(/(\$[0-9]+\.[0-9]{2})/);
  if (amountMatches && amountMatches[1]) {
    extractedData.amount = amountMatches[1].trim();
  }
  
  return extractedData;
}

/**
 * Format extracted claim data into a readable summary
 */
export function formatExtractedDataSummary(data: ExtractedClaimData): string {
  const lines: string[] = [];
  
  if (data.invoiceNumber) lines.push(`Invoice Number: ${data.invoiceNumber}`);
  if (data.date) lines.push(`Date: ${data.date}`);
  if (data.customerName) lines.push(`Customer: ${data.customerName}`);
  if (data.productName) lines.push(`Product: ${data.productName}`);
  if (data.amount) lines.push(`Amount: ${data.amount}`);
  
  return lines.join('\n');
}
