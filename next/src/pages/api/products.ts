import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/services/backend/mongodb'

type Product = {}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Product>>
) {
  try {
    const client = await clientPromise
    const db = client.db('scrapy_mall')

    const { type, date, keyword, sort } = req.query
    let filter = {}

    if (type) {
      filter = { type }
    }

    if (date) {
      filter = { ...filter, creation_date: date }
    }

    if (keyword) {
      filter = { ...filter, keyword }
    }

    if (sort === '销量') {
      filter = { ...filter, sort }
    }

    console.log('Product filter: ' + JSON.stringify(filter))
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
