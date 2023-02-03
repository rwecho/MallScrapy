import { getProducts, MallType, ProductItem } from '@/services'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

const initialState = {
  items: [] as ProductItem[],
  selectedType: 'jd' as MallType,
  types: ['tmall', 'jd', 'duoduo'] as MallType[],
  selectedKeyword: '',
  selectedDate: new Date().toISOString(),
  selectedSort: '综合',
  isLoading: false,
  error: '',
}

type ExecuteQueryInput = {
  type: MallType
  keyword: string
  date: string
  sort: string
}

export const executeQuery = createAsyncThunk<{}, ExecuteQueryInput>(
  'home/execute-query',
  async (input, { rejectWithValue }) => {
    try {
      const { type, keyword, date, sort } = input
      const oldItems = await getProducts({
        type: type,
        keyword: keyword,
        date: moment(date).add(-1, 'days').format('YYYY-MM-DD'),
        sort,
      })

      const items = await getProducts({
        type: type,
        keyword: keyword,
        date: moment(date).format('YYYY-MM-DD'),
        sort,
      })

      if (oldItems.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]

          const oldItem = oldItems.find((o) => o.name === item.name)

          if (oldItem?.index === undefined) {
            continue
          }

          item.trend = item.index - oldItem.index
        }
      }

      return {
        items,
      }
    } catch (error) {
      throw rejectWithValue(error)
    }
  }
)

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    changeType: (state, action) => {
      state.selectedType = action.payload
    },
    changeKeyword: (state, action) => {
      state.selectedKeyword = action.payload
    },
    changeDate: (state, action) => {
      state.selectedDate = action.payload
    },
    changeSort: (state, action) => {
      state.selectedSort = action.payload
    },
  },
  extraReducers: {
    [executeQuery.pending.toString()]: (state) => {
      state.isLoading = true
    },
    [executeQuery.fulfilled.toString()]: (state, action) => {
      state.isLoading = false
      state.items = action.payload.items
    },
    [executeQuery.rejected.toString()]: (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    },
  },
})

export const { changeType, changeKeyword, changeDate, changeSort } =
  homeSlice.actions

export default homeSlice.reducer
