export function processFilesInOrder(
    folderId: string,
    driveApp: typeof DriveApp,
    callback: (
        file: GoogleAppsScript.Drive.File,
        driveApp: typeof DriveApp
    ) => void
) {
    const folder = driveApp.getFolderById(folderId);
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
        console.log('processing: ' + file.getName());
        callback(file, driveApp);
    });
}

export function moveFileToProcessedFolder(
    file: GoogleAppsScript.Drive.File,
    processedFolderId: string,
    driveApp: GoogleAppsScript.Drive.DriveApp
) {
    console.log('moving to processed folder: ' + file.getName());
    const processedFolder = driveApp.getFolderById(processedFolderId);
    file.moveTo(processedFolder);
}
