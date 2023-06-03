/**引数のコールバック関数をすべてのシートのすべての範囲について実行する */
const doAllRange = (callback: (range: GoogleAppsScript.Spreadsheet.Range) => void) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    // sheets.forEach((sheet) => {
    // 	sheet.getRange(1, 1, 1000, 1000).setFontFamily("HiraKakuProN-W3");
    // });
    sheets.forEach((sheet) => {
        const allRange = sheet.getRange(1, 1, 1000, 1000);
        callback(allRange);
    });
};

const setFontAllRange = () => {
    const fontFamily = "HiraKakuProN-W3";
    doAllRange((range) => {
        range.setFontFamily(fontFamily);
    });
};

const setHehgtAllRange = () => {
    const height = 30;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    sheets.forEach((sheet) => {
        sheet.setRowHeights(1, 1000, height);
    });
};
