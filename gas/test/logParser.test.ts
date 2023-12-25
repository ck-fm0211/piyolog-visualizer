import fs from 'fs';
import path from 'path';
import { parseFileContent } from '../src/logParser';

describe('parseFileContent', () => {
    it('should parse correctly formatted file content', () => {
        const filePath = path.join(
            __dirname + '/fixture',
            'logParser__testdata__success.txt'
        );
        const content = fs.readFileSync(filePath, 'utf8');
        const result = parseFileContent(content);
        expect(result.length).toBe(3); // 配列の長さをチェック
        expect(result).toEqual([
            {
                date: '2023/12/17',
                time: '16:20',
                dateTime: '2023/12/17 16:20',
                activityParts: ['寝る'],
            },
            {
                date: '2023/12/17',
                time: '17:10',
                dateTime: '2023/12/17 17:10',
                activityParts: ['搾母乳', '50ml'],
            },
            {
                date: '2023/12/17',
                time: '21:10',
                dateTime: '2023/12/17 21:10',
                activityParts: ['おしっこ'],
            },
        ]);
    });

    it('should throw an error if the first line does not contain a date', () => {
        const filePath = path.join(
            __dirname + '/fixture',
            'logParser__testdata__fail_no_date.txt'
        );
        const content = fs.readFileSync(filePath, 'utf8');
        expect(() => parseFileContent(content)).toThrow(
            'Date not found in the first line of the file.'
        );
    });

    it('should throw an error if the file does not contain anything.', () => {
        const content = '';
        expect(() => parseFileContent(content)).toThrow('empty file.');
    });

    it('should return an empty array for an empty data file', () => {
        const filePath = path.join(
            __dirname + '/fixture',
            'logParser__testdata__success_no_data.txt'
        );
        const content = fs.readFileSync(filePath, 'utf8');
        const result = parseFileContent(content);
        expect(result).toEqual([]);
    });
});
