import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import Papa from 'papaparse';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PATCH') {
        try {
            const id = req.query.id as string;
            const newStatus = req.body.status;

            const filePath = path.join(process.cwd(), 'public', 'events.csv');
            const csvData = await fs.readFile(filePath, 'utf-8');
            const parsedData = Papa.parse<Event>(csvData, { header: true, skipEmptyLines: true });

            const updatedData = parsedData.data.map((e: Event) => {
                if (e.id === id) {
                    return { ...e, status: newStatus };
                }
                return e;
            });

            const updatedCsv = Papa.unparse(updatedData);
            await fs.writeFile(filePath, updatedCsv, 'utf-8');

            res.status(200).json({ message: 'Event status updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update event status' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
