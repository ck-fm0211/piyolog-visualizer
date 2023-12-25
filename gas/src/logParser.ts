export type LogEntry = {
    date: string;
    time: string;
    dateTime: string;
    activityParts: string[];
};

export function parseFileContent(content: string): LogEntry[] {
    if (!content) {
        throw new Error('empty file.');
    }
    const lines = content.split('\n');
    const dateLine = lines[0].trim();
    const dateMatch = dateLine.match(/(\d{4}\/\d{2}\/\d{2})/);
    if (!dateMatch) {
        throw new Error('Date not found in the first line of the file.');
    }
    const date = dateMatch[1];
    const logEntries: LogEntry[] = [];

    lines.slice(1).forEach(line => {
        const match = line.match(/^(\d{2}:\d{2})\s+(.*)$/);
        if (match) {
            const [, time, activity] = match;
            const dateTime = `${date} ${time}`;
            const activityParts = activity.split(/\s+/).filter(Boolean);

            // 数字（整数および小数）を抽出して追加
            activity.split(/\s+/).forEach(part => {
                // 時間表記の場合はスキップ
                if (/\(\d+時間\d+分\)/.test(part)) {
                    return;
                }

                const numberMatch = part.match(/(\d+(\.\d+)?)/);
                if (numberMatch) {
                    activityParts.push(numberMatch[0]);
                }
            });

            // 時間表記を分に変換して追加
            const timeMatch = activity.match(/\((\d+)時間(\d+)分\)/);
            if (timeMatch) {
                const hoursInMinutes = parseInt(timeMatch[1]) * 60;
                const minutes = parseInt(timeMatch[2]);
                activityParts.push((hoursInMinutes + minutes).toString());
            }

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
