import {
  Card,
  CardHeader,
  CardBody,
  Text,
  SimpleGrid,
  Select,
  HStack,
  Link,
  useToast,
  Box,
  Tooltip,
} from '@chakra-ui/react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import moment from 'moment'
import { ChangeEvent, useEffect, useState } from 'react'

import { Column } from 'react-table'
import { DataTable } from '../../Components'
import { FaArrowDown, FaArrowUp, FaLink, FaUps } from 'react-icons/fa'

type MallSelectProps = {
  onChange?: (mall: string) => void
  value?: string | undefined
}
const MallSelect = (props: MallSelectProps) => {
  const { onChange, value } = props

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(e.target.value)
  }

  return (
    <Select onChange={handleChange} value={value}>
      <option value="tmall">天猫</option>
      <option value="jd">京东</option>
      <option value="duoduo">拼多多</option>
    </Select>
  )
}

type ProductItem = {
  index: number
  url: string
  image: string
  name: string
  price: string
  store: string
  evaluate_num: string
  trend?: number
}

export const Home = () => {
  const [date, setDate] = useState(new Date())
  const [mall, setMall] = useState('tmall')
  const [items, setItems] = useState<ProductItem[]>([])

  const toast = useToast()
  const loadData = async (mall: string, date: Date) => {
    let yestoday_result: ProductItem[] = []
    try {
      const yestoday_url = `/app_data/${mall}_${moment(date)
        .add(-1, 'days')
        .format('YYYY-MM-DD')}.json`
      const yestoday_response = await fetch(yestoday_url)
      yestoday_result = await yestoday_response.json()
    } catch (error) {}

    try {
      const today_url = `/app_data/${mall}_${moment(date).format(
        'YYYY-MM-DD'
      )}.json`

      const today_response = await fetch(today_url)
      let today_result: ProductItem[] = await today_response.json()
      setItems(today_result)

      if (yestoday_result.length > 0) {
        for (let i = 0; i < today_result.length; i++) {
          const item = today_result[i]

          const yestoday_item = yestoday_result.find(
            (o) => o.name === item.name
          )

          if (yestoday_item?.index === undefined) {
            continue
          }

          item.trend = item.index - yestoday_item.index
        }
      }
      toast({
        title: '提醒',
        description: '加载成功',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (error) {
      setItems([])
      toast({
        title: '提醒',
        description: '无数据',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    loadData(mall, date)
  }, [mall, date])

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
        if (item.store.includes('小米')) {
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
        if (item.store.includes('小米')) {
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

  return (
    <Card>
      <CardHeader>
        <SimpleGrid my={4} columns={{ base: 4, sm: 2 }} spacing={4}>
          <HStack>
            <Text whiteSpace={'nowrap'}>选择商城: </Text>
            <MallSelect value={mall} onChange={setMall}></MallSelect>
          </HStack>
          <HStack>
            <Text whiteSpace={'nowrap'}>选择时间: </Text>
            <SingleDatepicker
              name="date-input"
              date={date}
              onDateChange={setDate}
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
      </CardHeader>
      <CardBody>
        <DataTable columns={columns} data={items}></DataTable>
      </CardBody>
    </Card>
  )
}
