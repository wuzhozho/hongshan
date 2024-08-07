// http://localhost:1337/api/auth/local

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiUrl = process.env.BACKEND_URL + `/auth/local`;

    if (req.method === 'POST') {
        try {
            console.log("======================Login:")
            console.log(apiUrl)
            console.log(req.body)
            const response = await axios.post(apiUrl, req.body);
            console.log('Well done!',response);
            console.log('User profile', response.data.user);
            console.log('User token', response.data.jwt);
            return res.status(201).json(response.data);
        } catch (err:any) {
            // console.error(err);
            console.log('An error occurred:---------', err.response.data.error);
            return res.status(500).json({ error: err.response.data.error.message });
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// response.data
//   {
            //     "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzE1NjAwNDY4LCJleHAiOjE3MTgxOTI0Njh9.ZEQNqgPqfOrzz9AP4kQ2kScbOcKz3J9nivzDdZfmXQw",
            //     "user": {
            //         "id": 6,
            //         "username": "12312322",
            //         "email": "1111@qq.com",
            //         "provider": "local",
            //         "confirmed": true,
            //         "blocked": false,
            //         "createdAt": "2024-05-13T11:41:08.256Z",
            //         "updatedAt": "2024-05-13T11:41:08.256Z"
            //     }
            // }