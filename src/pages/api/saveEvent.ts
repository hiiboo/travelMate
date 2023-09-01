import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
    try {
        // 現在のCSVデータを読み取る
        const filePath = path.join(process.cwd(), 'public', 'events.csv');
        const data = await fs.readFile(filePath, 'utf-8');

        const events = data.split('\n').slice(1); // ヘッダーを除外
        const latestId = events.length ? Math.max(...events.map(event => Number(event.split(',')[0]))) : 0;
        const newId = latestId + 1;

        // 新しいイベントデータを追加
        const newEventData = req.body.replace(/^(\d+),/, `${newId},`); // 新しいIDで置き換え
        const newData = data + '\n' + newEventData;

        // CSVファイルに新しいデータを書き込む
        const finalData = newData.trim().split('\n').filter(line => line.trim() !== '').join('\n') + '\n';
        await fs.writeFile(filePath, finalData, 'utf-8');

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to write to CSV' });
    }
    } else {
    res.status(405).json({ error: 'Method not allowed' });
    }
}

