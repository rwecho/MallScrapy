import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/pages/api/services/mongodb'

type Product = {}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Product>>
) {
  try {
    const client = await clientPromise
    const db = client.db('scrapy_mall')

    const { type, date, keyword } = req.query
    let filter = {}

    if (type) {
      filter = { type }
    }

    if (date) {
      filter = { ...filter, date }
    }

    if (keyword) {
      filter = { ...filter, keyword }
    }

    console.error(filter)

    const products = await db
      .collection('products')
      .find(filter)
      .limit(50)
      .toArray()
    res.json(products)
  } catch (error) {
    console.error(error)
    throw new Error(error as any).message
  }
}
