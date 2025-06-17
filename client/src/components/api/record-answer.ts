import { bktEngine } from '../../lib/bkt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const record = req.body
      await bktEngine.recordAnswer(record)
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) })
    }
  } else {
    res.status(405).end() // Method Not Allowed
  }
}
