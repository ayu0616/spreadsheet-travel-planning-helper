const myFunction = () => {
    const sheet = SpreadsheetApp.getActiveSheet();
    for (let i = 2; i <= sheet.getLastRow(); i++) {
        const kensaku = sheet.getRange(i, 4);
        kensaku.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(kensaku.getValue()).setLinkUrl(sheet.getRange(i, 6).getValue()).build());
        const map = sheet.getRange(i, 5);
        map.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(map.getValue()).setLinkUrl(sheet.getRange(i, 7).getValue()).build());
    }
};
