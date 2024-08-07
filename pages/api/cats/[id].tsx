// pages/api/cats/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query: { id } } = req;
    const apiUrl = `http://localhost:1337/api/cats/${id}`;

    if (req.method === 'GET') {
        try {
            const response = await axios.get(apiUrl);
            return res.status(200).json(response.data);
        } catch (err:any) {
            console.error(err);
            return res.status(500).json({ error: `Error in fetching cat data with id: ${id}` });
        }
    } else if (req.method === 'PUT') {
        try {
            const response = await axios.put(apiUrl, { "data": req.body });
            return res.status(200).json(response.data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: `Error in updating cat with id: ${id}`});
        }
    } else if (req.method === 'DELETE') {
        try {
            await axios.delete(apiUrl);
            return res.status(204).end();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: `Error in deleting cat with id: ${id}`});
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}