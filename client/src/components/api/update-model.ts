import { bktEngine } from '../../lib/bkt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { skillId } = req.body

  if (req.method === 'POST' && typeof skillId === 'string') {
    try {
      await bktEngine.updateModelParameters(skillId)
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ error: String(error) })
    }
  } else {
    res.status(400).json({ error: 'Missing or invalid skillId' })
  }
}