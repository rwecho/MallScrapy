import clientPromise from '@/pages/api/services/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {
  try {
    const client = await clientPromise
    const db = client.db('scrapy_mall')

    const { type } = req.query

    const keywords = await db
      .collection('products')
      .distinct('keyword', { type: type })
    res.json(keywords)
  } catch (error) {
    console.error(error)
    throw new Error(error as any).message
  }
}
