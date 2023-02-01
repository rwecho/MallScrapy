import { MallType } from '.'

export const getKeywords = async (type: MallType) => {
  try {
    const url = `/api/keywords?type=${type}`
    const response = await fetch(url)

    if (response.status >= 300) {
      return []
    }
    return (await response.json()) as string[]
  } catch (error) {
    return []
  }
}
