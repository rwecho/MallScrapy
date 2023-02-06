import { MallType } from '.'

export const getKeywords = async () => {
  try {
    const url = `/api/keywords?type=jd`
    const response = await fetch(url)

    if (response.status >= 300) {
      return []
    }
    return (await response.json()) as string[]
  } catch (error) {
    return []
  }
}
