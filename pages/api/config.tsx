// http://localhost/api/config


import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiUrl = process.env.BACKEND_URL + `/config`;

    if (req.method === 'GET') {
        try {
            console.log("======================get config:")
            console.log(apiUrl)
            // console.log(req.body)
            const response = await axios.get(apiUrl, 
                {
                    headers: {
                    Authorization: req.headers.authorization,
                    },
                });
            // console.log("-------------",response)
            return res.status(201).json(response.data);
        } catch (err:any) {
            console.error(err);
            return res.status(500).json({ error: "Error in get config." });
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}