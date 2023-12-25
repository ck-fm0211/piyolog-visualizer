import { LogEntry } from './logParser';

export function writeToSpreadsheet(
    spreadsheetId: string,
    logEntries: LogEntry[],
    spreadsheetApp: typeof SpreadsheetApp
) {
    // ログエントリが空の場合は処理をスキップ
    if (logEntries.length === 0) {
        return;
    }

    const ss = spreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName('Data') || ss.insertSheet('Data');

    // ログエントリを2次元配列に変換
    const data = logEntries.map(entry => [
        entry.date,
        entry.time,
        entry.dateTime,
        ...entry.activityParts,
    ]);

    // 最大列数を見つける
    const maxColumns = data.reduce((max, row) => Math.max(max, row.length), 0);

    // すべての行を最大列数に合わせる
    const normalizedData = data.map(row => {
        while (row.length < maxColumns) {
            row.push(''); // 空のセルで埋める
        }
        return row;
    });

    // 一度にスプレッドシートに書き込む
    const startRow = sheet.getLastRow() + 1;
    const range = sheet.getRange(
        startRow,
        1,
        normalizedData.length,
        maxColumns
    );
    range.setValues(normalizedData);

    // 重複排除処理
    removeDuplicates(sheet);

    createActivitySheets(ss, logEntries);
}

export function removeDuplicates(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    const dataRange = sheet.getDataRange();
    const data = dataRange.getValues();

    // データをフォーマットし、文字列化して一意のセットを作成
    const uniqueRowsSet = new Set(
        data.map(row => {
            return JSON.stringify(
                row.map((cell, index) => {
                    if (cell instanceof Date) {
                        // 日付データをフォーマット
                        return index === 0
                            ? Utilities.formatDate(
                                  cell,
                                  Session.getScriptTimeZone(),
                                  'yyyy/MM/dd'
                              )
                            : index === 1
                              ? Utilities.formatDate(
                                    cell,
                                    Session.getScriptTimeZone(),
                                    'HH:mm'
                                )
                              : index === 2
                                ? Utilities.formatDate(
                                      cell,
                                      Session.getScriptTimeZone(),
                                      'yyyy/MM/dd HH:mm'
                                  )
                                : cell;
                    } else {
                        return cell;
                    }
                })
            );
        })
    );

    // 一意のデータのみを2次元配列に戻す
    const uniqueData = Array.from(uniqueRowsSet).map(rowStr =>
        JSON.parse(rowStr)
    );

    // シートをクリアしてユニークなデータを書き込む
    sheet.clearContents();
    if (uniqueData.length > 0) {
        sheet
            .getRange(1, 1, uniqueData.length, uniqueData[0].length)
            .setValues(uniqueData);
    }
}

export function createActivitySheets(
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
    logEntries: LogEntry[]
) {
    const activities = new Set(logEntries.map(entry => entry.activityParts[0]));

    // 既存のシート名を取得
    const existingSheets = ss.getSheets().reduce((acc, sheet) => {
        acc.add(sheet.getName());
        return acc;
    }, new Set<string>());

    activities.forEach(activity => {
        if (!existingSheets.has(activity)) {
            // 新しいシートを作成する必要がある場合のみ作成
            const sheet = ss.insertSheet(activity);
            const formula = `=QUERY(Data!A:G, "SELECT * WHERE D = '${activity}'")`;
            sheet.getRange('A1').setFormula(formula);
        }
        // 既存のシートはそのままにする
    });
}
