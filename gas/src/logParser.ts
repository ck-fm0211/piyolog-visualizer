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
    let maxLength = 0;

    // ステップ1: 各行をパース
    lines.slice(1).forEach(line => {
        const match = line.match(/^(\d{2}:\d{2})\s+(.*)$/);
        if (match) {
            const [, time, activity] = match;
            const dateTime = `${date} ${time}`;
            const activityParts = activity.split(/\s+/).filter(Boolean);

            logEntries.push({
                date,
                time,
                dateTime,
                activityParts,
            });

            // 最長の配列を見つける
            if (activityParts.length > maxLength) {
                maxLength = activityParts.length;
            }
        }
    });

    // ステップ4: 数値を追加
    logEntries.forEach(entry => {
        const activityPartsOriginal = [...entry.activityParts];
        activityPartsOriginal.forEach(part => {
            // 時間表記を分に変換して追加
            const timeMatch = part.match(/\((\d+)時間(\d+)分\)/);
            if (timeMatch) {
                const hoursInMinutes = parseInt(timeMatch[1]) * 60;
                const minutes = parseInt(timeMatch[2]);
                while (entry.activityParts.length < maxLength) {
                    entry.activityParts.push('');
                }
                entry.activityParts.push((hoursInMinutes + minutes).toString());
            }

            // 時間表記の場合はスキップ
            if (/\(\d+時間\d+分\)/.test(part)) {
                return;
            }

            // 数字（整数および小数）を抽出して追加
            const numberMatch = part.match(/(\d+(\.\d+)?)/);
            if (numberMatch) {
                while (entry.activityParts.length < maxLength) {
                    entry.activityParts.push('');
                }
                entry.activityParts.push(numberMatch[0]);
            }
        });
    });

    return logEntries;
}
