import { getLatestFileData } from './fileHandler';
import { writeToSpreadsheet } from './spreadsheetHandler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
    const folderId =
        PropertiesService.getScriptProperties().getProperty('folderId'); // Google DriveのフォルダIDを設定
    if (!folderId) {
        throw new Error('プロパティ「folderId」が見つかりません。');
    }
    const spreadsheetId =
        PropertiesService.getScriptProperties().getProperty('spreadsheetId'); // スプレッドシートのIDを設定
    if (!spreadsheetId) {
        throw new Error('プロパティ「spreadsheetId」が見つかりません。');
    }

    const logEntries = getLatestFileData(folderId, DriveApp);
    writeToSpreadsheet(spreadsheetId, logEntries, SpreadsheetApp);
}
