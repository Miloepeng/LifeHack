import { bktEngine } from '../../lib/bkt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, skillId } = req.query

  if (req.method === 'GET' && typeof userId === 'string' && typeof skillId === 'string') {
    try {
      const question = await bktEngine.getNextQuestion(userId, skillId)
      res.status(200).json(question)
    } catch (error) {
      res.status(500).json({ error: String(error) })
    }
  } else {
    res.status(400).json({ error: 'Invalid parameters' })
  }
}