import { ButtonGroup, Button } from '@chakra-ui/react'
export type PaginationProps = {
  totalCount: number
  pageSize: number
  pageIndex: number
  onChange: (pageIndex: number) => void
}

const getVisiblePages = (maxPageSize: number, pageIndex: number) => {
  if (maxPageSize <= 5) {
    return Array.from(Array(maxPageSize).keys())
  }
  if (pageIndex <= 2) {
    return Array.from(Array(5).keys())
  }
  if (pageIndex >= maxPageSize - 2) {
    return Array.from(Array(5).keys()).map((i) => i + maxPageSize - 5)
  }
  return Array.from(Array(5).keys()).map((i) => i + pageIndex - 2)
}

const Pagination = (props: PaginationProps) => {
  const { totalCount, pageSize, pageIndex, onChange } = props
  const maxPages = Math.ceil(totalCount / pageSize)

  const canPreviousPage = () => {
    return pageIndex > 0
  }

  const canNextPage = () => {
    return pageIndex < maxPages - 1
  }
  const gotoPage = (page: number) => {
    onChange(page)
  }

  const visiblePages = getVisiblePages(maxPages, pageIndex)
  return (
    <ButtonGroup>
      <Button
        onClick={() => gotoPage(pageIndex - 1)}
        disabled={!canPreviousPage()}
        ml={2}
        rounded={0}
      >
        &lt;
      </Button>
      {visiblePages.map((page, index) => (
        <Button
          key={index}
          onClick={() => gotoPage(page)}
          rounded={0}
          color={page === pageIndex ? 'white' : undefined}
          bg={page === pageIndex ? 'teal.500' : undefined}
        >
          {page + 1}
        </Button>
      ))}
      <Button
        onClick={() => gotoPage(pageIndex + 1)}
        disabled={!canNextPage()}
        mr={2}
        rounded={0}
      >
        &gt;
      </Button>
    </ButtonGroup>
  )
}

export default Pagination
