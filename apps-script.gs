// ═══════════════════════════════════════════════════════
//  CharityCRM Waitlist – Google Apps Script
//  Paste this into: script.google.com → New Project
// ═══════════════════════════════════════════════════════

const SHEET_NAME = 'Waitlist';

function doPost(e) {
  const sheet = getOrCreateSheet();

  let email = '';
  let timestamp = new Date().toISOString();

  try {
    const data = JSON.parse(e.postData.contents);
    email     = data.email     || '';
    timestamp = data.timestamp || timestamp;
  } catch (err) {
    // fallback: try form params
    email = e.parameter.email || '';
  }

  if (email) {
    sheet.appendRow([timestamp, email]);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle CORS preflight (GET)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    sheet.appendRow(['Timestamp', 'Email']);
    sheet.getRange('1:1').setFontWeight('bold');
  }

  return sheet;
}
