/**
 * 編集はローカルのTypeScriptファイルで行い、claspでpushしてください
 * プロジェクトディレクトリのURL：https://drive.google.com/drive/folders/1wYi3mH_1lUCmGrqUVrIxCht5Dolwwono?usp=share_link
 */

import * as Cheerio from "cheerio";

/**
 * メインで実行する関数
 * トリガーではこれを指定しておけばとりあえず大丈夫
 */
const main = () => {
    writeTime();
    changeFontSize();
};

/**URLからCheerioを返す */
const createCheerio = (url: string) => {
    const res = UrlFetchApp.fetch(url, { method: "get", headers: { "X-Requested-With": "XMLHttpRequest" } }).getContentText();
    const $ = Cheerio.load(res, { decodeEntities: false });
    return $;
};

/**Yahoo乗換案内のリンクから必要なデータを取得
 * Yahoo!乗換案内がヨーロッパからアクセスできなくなったから別の乗換案内を利用しないといけない
 */
const dataFromTransfer = (url: string) => {
    const $ = createCheerio(url);
    const times = $("ul.time").text();
    const start = times.slice(0, 5);
    const end = times.slice(-5);
    const station = $("h1.title").text();
    return { start: start, end: end, station: station };
};

/**乗換案内のリンクから必要なデータを取得
 * サービスはジョルダンを使ってみる（検索結果の「テキスト」のURLを利用する）
 */
// const dataFromTransfer = (url: string) => {
//     const $ = createCheerio(url);
//     const preElemText = $("#left > pre").text(); // 乗り換え情報が書いてある要素のテキスト
//     const times = preElemText.replaceAll(/[()]/g, "").match(/発着時間：\d\d:\d\d発 → \d\d:\d\d着/);
//     const timeArray = times ? times[0].replace(/[^\d:→]/g, "").split("→") : ["", ""];
//     const start = timeArray[0];
//     const end = timeArray[1];
//     const station = $("head > title").text().replace("テキスト - ", "").replace("の乗換案内 - ジョルダン", "").replace("から", "→");
//     return { start: start, end: end, station: station };
// };

/**移動の開始時間と終了時間を転記する */
const writeTime = () => {
    const sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet.getSheetName().startsWith("スケジュール")) {
        return;
    }
    const activeCell = sheet.getActiveCell();
    const rowNum = activeCell.getRow();
    const colNum = activeCell.getColumn();
    const activeValue = activeCell.getRichTextValue();
    // 備考欄の記述がなければreturn
    if (colNum != 7 || !activeValue) {
        return;
    }
    let url;
    // 備考欄からURLを取得
    const transitUrl = "https://yahoo.jp/";
    // const transitUrl = "https://www.jorudan.co.jp/norikae/cgi/nori.cgi"
    if (activeValue.getText().includes("乗換案内")) {
        url = activeValue.getLinkUrl();
    } else if (activeValue.getText().startsWith(transitUrl)) {
        url = activeValue.getText();
    }
    if (!url) {
        return;
    }
    // データを取得
    const data = dataFromTransfer(url);

    activeCell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText("乗換案内").setLinkUrl(url).build());
    // 転記する
    sheet.getRange(rowNum, 2).setValue(data.start);
    sheet.getRange(rowNum, 3).setValue(data.end);
    sheet.getRange(rowNum, 6).setValue(data.station);
    sheet.getRange(rowNum, 5).setValue("移動");
};

/**サイトのタイトルを取得する */
const getSiteTitle = (url: string) => {
    const $ = createCheerio(url);
    const title = $("title").first().text();
    return title;
};

/**チェックされている行についてタイトルを転記する */
const writeTitle = () => {
    const sheet = SpreadsheetApp.getActiveSheet();
    // 観光地の詳細シートでなければreturn
    const sheetName = sheet.getSheetName();
    const sheetList = ["A_倉敷", "B_宮島", "C_尾道"];
    if (!sheetList.includes(sheetName)) {
        return;
    }
    const activeCell = sheet.getActiveCell();
    const rowNum = activeCell.getRow();
    // チェックボックスがfalseならreturn
    if (!sheet.getRange(rowNum, 4).getValue()) {
        return;
    }
    /**URLがあるセルのvalue */
    const urlValue = sheet.getRange(rowNum, 3).getRichTextValue();
    /**URL */
    const url = urlValue?.getLinkUrl();
    if (!url) {
        sheet.getRange(rowNum, 4).setValue(false);
        return;
    }
    /**サイトのタイトル */
    const title = getSiteTitle(url);
    // 転記する
    sheet.getRange(rowNum, 2).setValue(title);
    // チェックボックスを戻す
    sheet.getRange(rowNum, 4).setValue(false);
};

/**タグが「観光」となっている行の内容欄のフォントサイズを変更する */
const changeFontSize = () => {
    const DEFAULT_FONT_SIZE = 12;
    const BIGGER_FONT_SIZE = 16;

    const sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet.getSheetName().startsWith("スケジュール")) {
        return;
    }
    /**現在選択しているセル */
    const activeCell = sheet.getActiveCell();
    const colNum = activeCell.getColumn();
    // 5列目（タグの列）でなければreturn
    if (colNum != 5) return;

    const rowNum = activeCell.getRow();
    /**同じ行の「内容」欄のセル */
    const contentCell = sheet.getRange(rowNum, 6);

    const activeValue = activeCell.getRichTextValue();
    if (activeValue?.getText() == "観光") {
        // タグが「観光」ならフォントサイズを大きくする
        contentCell.setFontSize(BIGGER_FONT_SIZE);
    } else {
        // タグが「観光」でなければフォントサイズを戻す
        contentCell.setFontSize(DEFAULT_FONT_SIZE);
    }
};
