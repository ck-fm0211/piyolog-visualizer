export type LogEntry = {
    date: string;
    time: string;
    dateTime: string;
    activityParts: string[];
};

export function parseFileContent(content: string): LogEntry[] {
    const lines = content.split('\n');
    const dateLine = lines[0].trim();
    const dateMatch = dateLine.match(/(\d{4}\/\d{2}\/\d{2})/);
    if (!dateMatch) {
        throw new Error('Date not found in the first line of the file.');
    }
    const date = dateMatch[1]; // 日付をそのまま使用
    const logEntries: LogEntry[] = [];

    lines.slice(1).forEach(line => {
        const match = line.match(/^(\d{2}:\d{2})\s+(.*)$/);
        if (match) {
            const [, time, activity] = match;
            const dateTime = `${date} ${time}`; // 日付と時刻を結合
            const activityParts = activity.split(/\s+/);
            logEntries.push({
                date,
                time,
                dateTime,
                activityParts,
            });
        }
    });

    return logEntries;
}
