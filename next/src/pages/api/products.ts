import clientPromise from '@/services/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

type Product = {}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Product>>
) {
  try {
    const client = await clientPromise
    const db = client.db('scrapy_mall')

    const { type, date } = req.query

    const products = await db
      .collection('products')
      .find({ type: type, creation_day: date })
      .limit(50)
      .toArray()
    res.json(products)
  } catch (error) {
    console.error(error)
    throw new Error(error as any).message
  }
}
