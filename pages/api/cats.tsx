
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiUrl = 'http://localhost:1337/api/cats';

    if (req.method === 'GET') {
        try {
            const response = await axios.get(apiUrl);
            return res.status(200).json(response.data.data);
        } catch (err:any) {
            console.error(err);
            return res.status(500).json({ error: "Error in fetching cats data." });
        }
    } else if (req.method === 'POST') {
        try {
            console.log(req.body)
            const response = await axios.post(apiUrl, { "data": req.body });
            return res.status(201).json(response.data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Error in creating new cat." });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}