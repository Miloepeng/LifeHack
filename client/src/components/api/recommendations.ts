import { bktEngine } from '../../lib/bkt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (req.method === 'GET' && typeof userId === 'string') {
    try {
      const recommendations = await bktEngine.getLearningRecommendations(userId)
      res.status(200).json(recommendations)
    } catch (error) {
      res.status(500).json({ error: String(error) })
    }
  } else {
    res.status(400).json({ error: 'Missing or invalid userId' })
  }
}