// http://localhost/api/openai_log


import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiUrl = process.env.BACKEND_URL + `/openai-logs`;

    if (req.method === 'POST') {
        try {
            // console.log("======================openai_log:")
            // console.log(apiUrl)
            // console.log(req.body)
            // console.log(req.headers)
            const response = await axios.post(apiUrl, { "data": req.body },
            {
                headers: {
                  Authorization: req.headers.authorization,
                },
            });
            return res.status(201).json(response.data);
        } catch (err:any) {
            console.error(err);
            return res.status(500).json({ error: "Error in creating new log." });
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}