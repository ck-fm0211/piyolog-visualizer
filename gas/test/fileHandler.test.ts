import {
    processFilesInOrder,
    moveFileToProcessedFolder,
} from '../src/fileHandler';

describe('processFilesInOrder', () => {
    it('should process files in the correct order based on last updated timestamp', () => {
        const folderId = 'folderId1';
        const mockFile1 = {
            getLastUpdated: jest
                .fn()
                .mockReturnValue(new Date(2020, 1, 1, 10, 30)),
            moveTo: jest.fn(),
            getName: jest.fn(),
        } as unknown as GoogleAppsScript.Drive.File;
        const mockFile2 = {
            getLastUpdated: jest
                .fn()
                .mockReturnValue(new Date(2020, 1, 1, 10, 31)),
            moveTo: jest.fn(),
            getName: jest.fn(),
        } as unknown as GoogleAppsScript.Drive.File;
        let fileIndex = 0;
        const mockFiles = {
            hasNext: jest.fn(() => fileIndex < 2),
            next: jest.fn(() => (fileIndex++ === 0 ? mockFile1 : mockFile2)),
        };
        const mockFolder = {
            getFiles: jest.fn().mockReturnValue(mockFiles),
        };
        const driveApp = {
            getFolderById: jest
                .fn()
                .mockImplementation(id =>
                    id === folderId ? mockFolder : null
                ),
        } as unknown as typeof DriveApp;
        const callback = jest.fn();

        processFilesInOrder(folderId, driveApp, callback);

        expect(driveApp.getFolderById).toHaveBeenCalledWith(folderId);
        expect(mockFiles.hasNext).toHaveBeenCalledTimes(3); // 2 files + 1 final call returning false
        expect(callback).toHaveBeenNthCalledWith(1, mockFile1, driveApp);
        expect(callback).toHaveBeenNthCalledWith(2, mockFile2, driveApp);
    });
});

describe('moveFileToProcessedFolder', () => {
    it('should move file to processed folder', () => {
        const file = {
            moveTo: jest.fn(),
            getName: jest.fn(),
        } as unknown as GoogleAppsScript.Drive.File;
        const processedFolderId = 'processedFolderId';
        const processedFolder = {};
        const driveApp = {
            getFolderById: jest.fn().mockReturnValue(processedFolder),
        } as unknown as GoogleAppsScript.Drive.DriveApp;

        moveFileToProcessedFolder(file, processedFolderId, driveApp);

        expect(driveApp.getFolderById).toHaveBeenCalledWith(processedFolderId);
        expect(file.moveTo).toHaveBeenCalledWith(processedFolder);
    });
});
