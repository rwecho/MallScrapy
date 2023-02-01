import {
  Box,
  Flex,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Heading,
  Tbody,
  Td,
  Text,
  Center,
} from '@chakra-ui/react'
import { Column, useTable, useGlobalFilter, useSortBy } from 'react-table'
import Pagination from './Pagination'

export interface Pagination {
  totalCount: number
  pageSize: number
  pageIndex: number
  onPageChanged?: (pageIndex: number) => void
}

export type ExtraCommand<T> = {
  title: string
  action: (row: T) => void
}

export type DataTableProps<T> = {
  columns: Column[]
  data: Array<T>
  title?: string
  pagination?: Pagination
  add?: () => void
  update?: (row: T) => void
  remove?: (row: T) => void
  commands?: Array<ExtraCommand<T>>
}

export const DataTable = <T extends object>(props: DataTableProps<T>) => {
  const { columns, data, title, pagination, add, update, remove, commands } =
    props

  const { totalCount, pageSize, pageIndex, onPageChanged } = pagination || {
    totalCount: 0,
    pageSize: 0,
    pageIndex: 0,
    onPageChanged: () => {},
  }
  // const textColor = useColorModeValue('secondaryGray.900', 'white')
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
    // usePagination
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  return (
    <Box
      dir="column"
      w="100%"
      px="0px"
      pb={4}
      pos={'relative'}
      overflowX={'hidden'}
    >
      {title && (
        <Flex px="25px" justify="space-between" mb="10px" align="center">
          <Text
            color={'gray.400'}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            {title}
          </Text>
          {add && <Button onClick={() => add()}>添加</Button>}
        </Flex>
      )}
      <Table {...getTableProps()} variant="simple" mb="24px">
        <Thead bg={'gray.50'}>
          {headerGroups.map((headerGroup: any, index: number) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column: any, index: number) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={index}
                >
                  <Flex justify="space-between" align="center">
                    <Heading size={'sm'}>{column.render('Header')}</Heading>
                  </Flex>
                </Th>
              ))}
              {(update || remove) && (
                <Th>
                  <Flex justify="space-between" align="center">
                    <Heading size={'sm'}>操作</Heading>
                  </Flex>
                </Th>
              )}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row: any, index: number) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell: any, index: number) => (
                  <Td key={index}>
                    <Flex
                      align="center"
                      color={'gray.600'}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      {cell.render('Cell')}
                    </Flex>
                  </Td>
                ))}
                {(update || remove || commands) && (
                  <Td>
                    {update && (
                      <Button onClick={() => update(row.original)}>编辑</Button>
                    )}
                    {remove && (
                      <Button onClick={() => remove && remove(row.original)}>
                        删除
                      </Button>
                    )}

                    {commands &&
                      commands.map((command, index) => {
                        return (
                          <Button
                            key={index}
                            onClick={() =>
                              command && command.action(row.original)
                            }
                          >
                            {command.title}
                          </Button>
                        )
                      })}
                  </Td>
                )}
              </Tr>
            )
          })}
        </Tbody>
      </Table>

      {rows.length === 0 && (
        <Center>
          <Text color="gray.400">没有数据</Text>
        </Center>
      )}

      {pagination && totalCount > pageSize && (
        <Center mt={4}>
          <Text>
            当前第
            <Text as={'span'} fontWeight={'bold'} mx={2}>
              {pageIndex + 1}
            </Text>
            页
          </Text>
          <Pagination
            totalCount={totalCount}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onChange={(page) => onPageChanged && onPageChanged(page)}
          ></Pagination>
          <Text>
            共{' '}
            <Text as={'span'} fontWeight={'bold'} mx={2}>
              {Math.ceil(totalCount / pageSize)}
            </Text>
            页
          </Text>

          <Text>
            共{' '}
            <Text as={'span'} fontWeight={'bold'} mx={2}>
              {totalCount}
            </Text>
            条
          </Text>
        </Center>
      )}
    </Box>
  )
}
