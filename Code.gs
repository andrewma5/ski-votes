/**
 * Ski trip vote backend. Paste this into Extensions → Apps Script on a Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * GET  returns {votes:[{id,data}]}
 * POST body {id, data} creates or replaces that voter's row.
 */
const SHEET = 'Votes';
const HEADER = ['id', 'updated', 'name', 'Belleayre', 'Hunter', 'Windham',
  'BLY house', 'HNT house', 'WND house', 'max $/pp', 'black diamond', 'wants', 'note', 'json'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(HEADER);
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const votes = [];
  rows.forEach(r => {
    try { if (r[0]) votes.push({ id: String(r[0]), data: JSON.parse(r[13]) }); } catch (e) {}
  });
  return json_({ votes });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const id = String(body.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 64);
    const d = body.data || {};
    if (!id || typeof d !== 'object') return json_({ ok: false, error: 'bad request' });
    const json = JSON.stringify(d);
    if (json.length > 5000) return json_({ ok: false, error: 'too large' });
    const c = d.conv || {}, h = d.house || {};
    const row = [id, new Date(), String(d.nick || '').slice(0, 40), c.BLY, c.HNT, c.WND,
      h.BLY || '', h.HNT || '', h.WND || '', d.limit || '', d.risk || '',
      (d.tags || []).join(', '), String(d.memo || '').slice(0, 400), json];
    const sh = sheet_();
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
    const at = ids.indexOf(id);
    if (at > 0) sh.getRange(at + 1, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
