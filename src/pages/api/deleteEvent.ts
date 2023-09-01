import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import Papa from 'papaparse';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    type Event = {
        id: string;
        title: string;
        organizer_id: string;
        location: string;
        description: string;
        event_image_path: string;
        start_date_time: string;
        end_date_time: string;
        status: string;
        created_at: string;
        updated_at: string;
    };

    if (req.method === 'DELETE') {
        try {
            const id = req.query.id as string;

            const filePath = path.join(process.cwd(), 'public', 'events.csv');
            const csvData = await fs.readFile(filePath, 'utf-8');
            const parsedData = Papa.parse<Event>(csvData, { header: true, skipEmptyLines: true });
            const updatedData = parsedData.data.filter((e: Event) => e.id !== id);
            const updatedCsv = Papa.unparse(updatedData);
            const finalCsv = updatedCsv.trim().split('\n').filter(line => line.trim() !== '').join('\n') + '\n';
            await fs.writeFile(filePath, finalCsv, 'utf-8');

            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete event' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}