import { processFilesInOrder, moveFileToProcessedFolder } from './fileHandler';
import { writeToSpreadsheet } from './spreadsheetHandler';
import { parseFileContent } from './logParser';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main() {
    const folderId =
        PropertiesService.getScriptProperties().getProperty('folderId');
    if (!folderId) {
        throw new Error('プロパティ「folderId」が見つかりません。');
    }
    const spreadsheetId =
        PropertiesService.getScriptProperties().getProperty('spreadsheetId');
    if (!spreadsheetId) {
        throw new Error('プロパティ「spreadsheetId」が見つかりません。');
    }
    const processedFolderId =
        PropertiesService.getScriptProperties().getProperty(
            'processedFolderId'
        );
    if (!processedFolderId) {
        throw new Error('プロパティ「processedFolderId」が見つかりません。');
    }

    processFilesInOrder(
        folderId,
        processedFolderId,
        DriveApp,
        (file, driveApp) => {
            const logEntries = parseFileContent(
                file.getBlob().getDataAsString()
            );
            writeToSpreadsheet(spreadsheetId, logEntries, SpreadsheetApp);
            moveFileToProcessedFolder(file, processedFolderId, driveApp); // カスタム関数を使用
        }
    );
}
