import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  SimpleGrid,
  useToast,
  Text,
  Link,
  Tooltip,
  Button,
} from '@chakra-ui/react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { Column } from 'react-table'
import {
  DefaultLayout,
  DataTable,
  Select,
  LoadingBox,
} from '@/components/shared'
import { FaArrowDown, FaArrowUp, FaLink } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  changeDate,
  changeKeyword,
  changeType,
  executeQuery,
} from '@/store/slices/homeSlice'

export const Home = () => {
  const {
    isLoading,
    selectedType,
    selectedKeyword,
    selectedDate,
    keywords,
    items,
  } = useAppSelector((state) => state.home)
  const dispatch = useAppDispatch()
  const toast = useToast()

  const product_keywords = process.env.NEXT_PUBLIC_PRODUCT_KEYWORDS

  const columns: Column<any>[] = [
    {
      Header: '序号',
      accessor: 'index',
      Cell: ({ cell }) => {
        const item = cell.row.original

        const Trend = () => {
          if (item?.trend === 0 || item?.trend === undefined) {
            return <></>
          } else if (item.trend > 0) {
            const tooltip = `排名提升${item?.trend}位`
            return (
              <Tooltip label={tooltip}>
                <Text color="red.400">
                  <FaArrowUp></FaArrowUp>
                </Text>
              </Tooltip>
            )
          } else {
            const tooltip = `排名下降${Math.abs(item?.trend)}位`
            return (
              <Tooltip label={tooltip}>
                <Text color={'green.400'}>
                  <FaArrowDown></FaArrowDown>
                </Text>
              </Tooltip>
            )
          }
        }

        return (
          <HStack>
            <Text>{item.index}</Text>
            <Trend></Trend>
          </HStack>
        )
      },
    },
    {
      Header: '店铺名称',
      accessor: 'store',
      Cell: ({ cell }) => {
        const item = cell.row.original
        let color = ''
        if (item.store.includes(product_keywords)) {
          color = 'teal.400'
        }

        return <Text color={color}>{item.store}</Text>
      },
    },
    {
      Header: '商品名称',
      accessor: 'name',
      Cell: ({ cell }) => {
        const item = cell.row.original

        let color = ''
        if (item.store.includes(product_keywords)) {
          color = 'teal.400'
        }

        return (
          <Link href={item.url} isExternal>
            <HStack>
              <Text color={color}>{item.name}</Text>
              <FaLink />
            </HStack>
          </Link>
        )
      },
    },
    {
      Header: '价格',
      accessor: 'price',
    },
    {
      Header: '数量(评价数|付款数|已拼数)',
      accessor: 'evaluate_num',
    },
  ]

  const mallTypeList = [
    {
      value: 'tmall',
      text: '天猫',
    },
    {
      value: 'jd',
      text: '京东',
    },

    {
      value: 'duoduo',
      text: '拼多多',
    },
  ]
  return (
    <DefaultLayout>
      <LoadingBox isLoading={isLoading}>
        <Card>
          <CardHeader>
            <SimpleGrid my={4} columns={{ base: 1, md: 4 }} spacing={4}>
              <HStack>
                <Text whiteSpace={'nowrap'}>选择商城: </Text>
                <Select
                  items={mallTypeList}
                  valueMember={(t) => t.value}
                  textMember={(t) => t.text}
                  value={selectedType}
                  onChange={(item) => dispatch(changeType(item))}
                ></Select>
              </HStack>

              <HStack>
                <Text whiteSpace={'nowrap'}>关键字: </Text>
                <Select
                  items={keywords}
                  valueMember={(t: string) => t}
                  textMember={(t: string) => t}
                  value={selectedKeyword}
                  onChange={(item) => dispatch(changeKeyword(item))}
                  placeholder="不限制"
                ></Select>
              </HStack>
              <HStack>
                <Text whiteSpace={'nowrap'}>选择时间: </Text>
                <SingleDatepicker
                  name="date-input"
                  date={new Date(selectedDate)}
                  onDateChange={(date) => {
                    dispatch(changeDate(date.toISOString()))
                  }}
                  propsConfigs={{
                    dayOfMonthBtnProps: {
                      defaultBtnProps: {
                        _hover: {
                          background: 'teal.200',
                        },
                      },
                      selectedBtnProps: {
                        background: 'teal.400',
                        color: 'white',
                      },
                    },
                  }}
                />
              </HStack>

              <Button
                onClick={() =>
                  dispatch(
                    executeQuery({
                      type: selectedType,
                      keyword: selectedKeyword,
                      date: selectedDate,
                    })
                  )
                }
              >
                查询
              </Button>
            </SimpleGrid>
          </CardHeader>
          <CardBody>
            <DataTable columns={columns} data={items}></DataTable>
          </CardBody>
        </Card>
      </LoadingBox>
    </DefaultLayout>
  )
}
