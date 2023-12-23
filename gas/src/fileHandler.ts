import { LogEntry, parseFileContent } from './logParser';

export function getLatestFileData(
    folderId: string,
    driveApp: typeof DriveApp
): LogEntry[] {
    const folder = driveApp.getFolderById(folderId);
    const files = folder.getFiles();
    let latestFile = null;
    let latestDate = new Date(0); // JavaScriptの標準Dateオブジェクトを使用

    while (files.hasNext()) {
        const file = files.next();
        const date = new Date(file.getLastUpdated().getTime()); // JavaScriptの標準Dateオブジェクトに変換
        if (date > latestDate) {
            latestDate = date;
            latestFile = file;
        }
    }

    if (!latestFile) {
        throw new Error('No files found in the folder.');
    }

    const content = latestFile.getBlob().getDataAsString();
    return parseFileContent(content);
}
