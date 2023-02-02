import { MallType } from '.'

export type ProductItem = {
  index: number
  url: string
  image: string
  name: string
  price: string
  store: string
  evaluate_num: string
  trend?: number
}

export const getProducts = async ({
  type,
  date,
  keyword,
}: {
  type?: MallType
  date?: string
  keyword?: string
}) => {
  try {
    const url = `/api/products?type=${type}&creation_date=${date}&keyword=${keyword}`
    const response = await fetch(url)

    if (response.status >= 300) {
      return []
    }
    return (await response.json()) as ProductItem[]
  } catch (error) {
    return []
  }
}
