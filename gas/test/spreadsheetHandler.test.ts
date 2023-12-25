import {
    writeToSpreadsheet,
    removeDuplicates,
    createActivitySheets,
} from '../src/spreadsheetHandler';
import { LogEntry } from '../src/logParser';

// モックオブジェクトの作成
const mockSpreadsheetApp = {
    openById: jest.fn(),
} as unknown as GoogleAppsScript.Spreadsheet.SpreadsheetApp;

const mockSpreadsheet = {
    getSheetByName: jest.fn(),
    insertSheet: jest.fn(),
    getSheets: jest.fn(),
} as unknown as GoogleAppsScript.Spreadsheet.Spreadsheet;

const mockDataRange = {
    getValues: jest.fn(),
} as unknown as GoogleAppsScript.Spreadsheet.Range;

const mockRange = {
    setValues: jest.fn(),
    getValues: jest.fn(),
    setFormula: jest.fn(), // setFormulaのモックを追加
} as unknown as GoogleAppsScript.Spreadsheet.Range;

const mockSheet = {
    getLastRow: jest.fn(),
    getRange: jest.fn().mockReturnValue(mockRange), // getRangeのモックを追加
    clearContents: jest.fn(),
    getDataRange: jest.fn().mockReturnValue(mockDataRange),
    getName: jest.fn(),
} as unknown as GoogleAppsScript.Spreadsheet.Sheet;

// テストのセットアップ
beforeEach(() => {
    jest.clearAllMocks();

    // モック関数の戻り値を設定
    (mockSpreadsheetApp.openById as jest.Mock).mockReturnValue(mockSpreadsheet);
    (mockSpreadsheet.getSheetByName as jest.Mock).mockReturnValue(null);
    (mockSpreadsheet.insertSheet as jest.Mock).mockReturnValue(mockSheet);
    (mockSpreadsheet.getSheets as jest.Mock).mockReturnValue([mockSheet]);
    (mockSheet.getLastRow as jest.Mock).mockReturnValue(0);
    (mockSheet.getRange as jest.Mock).mockReturnValue(mockRange);
    (mockDataRange.getValues as jest.Mock).mockReturnValue([
        ['2023/12/25', '10:00', '2023/12/25 10:00', 'Activity1', 'Part1'],
    ]);
    (mockSheet.getName as jest.Mock).mockReturnValue('SheetName');
    (mockRange.setFormula as jest.Mock).mockReturnValue(null);
});

// LogEntry型の定義に基づいてテストデータを作成
const logEntries: LogEntry[] = [
    {
        date: '2023/12/25',
        time: '10:00',
        dateTime: '2023/12/25 10:00',
        activityParts: ['Activity1', 'Part1'],
    },
    {
        date: '2023/12/25',
        time: '10:01',
        dateTime: '2023/12/25 10:01',
        activityParts: ['Activity1', 'Part1', 'Part2'],
    },
    // 他のテスト用LogEntryオブジェクトを追加
];

// テストケース
describe('writeToSpreadsheet', () => {
    it('should write log entries to a spreadsheet', () => {
        writeToSpreadsheet('spreadsheetId', logEntries, mockSpreadsheetApp);

        expect(mockSpreadsheetApp.openById).toHaveBeenCalledWith(
            'spreadsheetId'
        );
        expect(mockSpreadsheet.insertSheet).toHaveBeenCalledWith('Data');
        expect(mockRange.setValues).toHaveBeenCalled();
    });

    it('should not write to the spreadsheet if log entries are empty', () => {
        writeToSpreadsheet('spreadsheetId', [], mockSpreadsheetApp);

        expect(mockSpreadsheet.insertSheet).not.toHaveBeenCalled();
        expect(mockRange.setValues).not.toHaveBeenCalled();
    });
});

describe('removeDuplicates', () => {
    it('should remove duplicate rows from a sheet', () => {
        removeDuplicates(mockSheet);

        expect(mockSheet.clearContents).toHaveBeenCalled();
        expect(mockSheet.getRange).toHaveBeenCalled();
        expect(mockRange.setValues).toHaveBeenCalled();
    });

    it('should keep all rows if there are no duplicates', () => {
        const uniqueData = [
            ['2023/12/25', '10:00', '2023/12/25 10:00', 'Activity1', 'Part1'],
            ['2023/12/26', '11:00', '2023/12/26 11:00', 'Activity2', 'Part2'],
        ];
        (mockDataRange.getValues as jest.Mock).mockReturnValue(uniqueData);

        removeDuplicates(mockSheet);

        expect(mockSheet.clearContents).toHaveBeenCalled();
        expect(mockRange.setValues).toHaveBeenCalledWith(uniqueData);
    });
});

describe('createActivitySheets', () => {
    it('should create new sheets for unique activities', () => {
        createActivitySheets(mockSpreadsheet, logEntries);

        expect(mockSpreadsheet.insertSheet).toHaveBeenCalled();
    });

    it('should not create a new sheet if it already exists', () => {
        const existingSheetName = 'Activity1';
        (mockSpreadsheet.getSheets as jest.Mock).mockReturnValue([
            { getName: () => existingSheetName },
        ]);

        createActivitySheets(mockSpreadsheet, logEntries);

        expect(mockSpreadsheet.insertSheet).not.toHaveBeenCalledWith(
            existingSheetName
        );
    });
});
