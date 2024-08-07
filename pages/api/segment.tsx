// pages/api/segment.ts

import { NextApiRequest, NextApiResponse } from 'next';
import nodejieba from "nodejieba";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;

    if(typeof text !== 'string') {
      res.status(400).json({ error: 'Invalid text provided' });
      return;
    }

    const result = nodejieba.cut(text);
    res.status(200).json({ segments: result });
  } else {
    res.status(405).end(); // 请求方法不允许
  }
}