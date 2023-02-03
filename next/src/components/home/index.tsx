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
  Box,
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
  changeSort,
  executeQuery,
} from '@/store/slices/homeSlice'

export const Home = () => {
  const {
    isLoading,
    selectedType,
    selectedKeyword,
    selectedDate,
    selectedSort,
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

  const sorts = ['综合', '销量']
  const keywords = [
    '防晒口罩',
    '防晒面罩',
    '防晒衣',
    '防晒袖套',
    '防晒服',
    '渔夫帽',
    '贝壳帽',
    '空顶帽',
    '防晒手套',
    '定型枕',
    '哺乳枕',
    '护肚围',
    '婴儿抱被',
    '婴儿睡袋',
    '婴儿喂奶袖套',
    '婴儿睡衣',
  ]

  const handleQuery = async () => {
    console.log(`product keywords: {product_keywords}`)
    await dispatch(
      executeQuery({
        type: selectedType,
        keyword: selectedKeyword,
        date: selectedDate,
        sort: selectedSort,
      })
    ).unwrap()

    toast({
      title: '提醒',
      description: '加载数据成功',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }
  return (
    <DefaultLayout>
      <LoadingBox isLoading={isLoading}>
        <Card display={'grid'}>
          <CardHeader>
            <SimpleGrid my={4} columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
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
                <Text whiteSpace={'nowrap'}>排序: </Text>
                <Select
                  items={sorts}
                  valueMember={(t: string) => t}
                  textMember={(t: string) => t}
                  value={selectedSort}
                  onChange={(item) => dispatch(changeSort(item))}
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
            </SimpleGrid>
            <HStack>
              <Button
                onClick={handleQuery}
                ml="auto"
                w={{ base: 'full', md: 'unset' }}
              >
                查询
              </Button>
            </HStack>
          </CardHeader>
          <CardBody overflowX={'auto'} w={'100%'}>
            <Box flexShrink={0}>
              <DataTable columns={columns} data={items}></DataTable>
            </Box>
          </CardBody>
        </Card>
      </LoadingBox>
    </DefaultLayout>
  )
}
