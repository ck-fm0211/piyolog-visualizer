export function processFilesInOrder(
    folderId: string,
    processedFolderId: string,
    driveApp: typeof DriveApp,
    callback: (
        file: GoogleAppsScript.Drive.File,
        driveApp: typeof DriveApp
    ) => void
) {
    const folder = driveApp.getFolderById(folderId);
    const processedFolder = driveApp.getFolderById(processedFolderId);
    const files = folder.getFiles();

    const sortedFiles = [];
    while (files.hasNext()) {
        sortedFiles.push(files.next());
    }

    // タイムスタンプが古い順にソート
    sortedFiles.sort(
        (a, b) => a.getLastUpdated().getTime() - b.getLastUpdated().getTime()
    );

    sortedFiles.forEach(file => {
        callback(file, driveApp);
        file.moveTo(processedFolder);
    });
}

export function moveFileToProcessedFolder(
    file: GoogleAppsScript.Drive.File,
    processedFolderId: string,
    driveApp: GoogleAppsScript.Drive.DriveApp
) {
    const processedFolder = driveApp.getFolderById(processedFolderId);
    file.moveTo(processedFolder);
}
