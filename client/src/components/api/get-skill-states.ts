import { bktEngine } from '../../lib/bkt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (req.method === 'GET' && typeof userId === 'string') {
    try {
      const states = await bktEngine.getStudentSkillStates(userId)
      res.status(200).json(states)
    } catch (error) {
      res.status(500).json({ error: String(error) })
    }
  } else {
    res.status(400).json({ error: 'Missing or invalid userId' })
  }
}