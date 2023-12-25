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
        console.log('###');
        console.log(result);
        console.log('###');
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
                activityParts: ['搾母乳', '50ml', '50'],
            },
            {
                date: '2023/12/17',
                time: '19:10',
                dateTime: '2023/12/17 19:10',
                activityParts: ['起きる', '(2時間50分)', '170'],
            },
            {
                date: '2023/12/17',
                time: '19:10',
                dateTime: '2023/12/17 19:10',
                activityParts: ['母乳', '左3分', '/', '右4分', '3', '4'],
            },
            {
                date: '2023/12/17',
                time: '19:10',
                dateTime: '2023/12/17 19:10',
                activityParts: ['体温', '37.1°C', '37.1'],
            },
            {
                date: '2023/12/17',
                time: '19:10',
                dateTime: '2023/12/17 19:10',
                activityParts: ['身長', '100.3cm', '100.3'],
            },
            {
                date: '2023/12/17',
                time: '19:15',
                dateTime: '2023/12/17 19:15',
                activityParts: ['起きる', '(50分)', '50'],
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
