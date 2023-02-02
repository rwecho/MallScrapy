import { getKeywords, getProducts, MallType, ProductItem } from '@/services'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

const initialState = {
  items: [] as ProductItem[],
  selectedType: 'jd' as MallType,
  keywords: [] as string[],
  types: ['tmall', 'jd', 'duoduo'] as MallType[],
  selectedKeyword: '',
  selectedDate: new Date().toISOString(),
  isLoading: false,
  error: '',
}

export const changeType = createAsyncThunk<{}, MallType>(
  'home/change-type',
  async (type, { rejectWithValue }) => {
    try {
      const keywords = await getKeywords(type)
      return {
        keywords,
        selectedType: type,
        selectedKeyword: keywords.length > 0 ? keywords[0] : '',
      }
    } catch (error) {
      throw rejectWithValue(error)
    }
  }
)

type ExecuteQueryInput = {
  type: MallType
  keyword: string
  date: string
}

export const executeQuery = createAsyncThunk<{}, ExecuteQueryInput>(
  'home/execute-query',
  async (input, { rejectWithValue }) => {
    try {
      const { type, keyword, date } = input
      const oldItems = await getProducts({
        type: type,
        keyword: keyword,
        date: moment(date).add(-1, 'days').format('YYYY-MM-DD'),
      })

      const items = await getProducts({
        type: type,
        keyword: keyword,
        date: moment(date).format('YYYY-MM-DD'),
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
    changeKeyword: (state, action) => {
      state.selectedKeyword = action.payload
    },
    changeDate: (state, action) => {
      state.selectedDate = action.payload
    },
  },
  extraReducers: {
    [changeType.pending.toString()]: (state) => {
      state.isLoading = true
    },
    [changeType.fulfilled.toString()]: (state, action) => {
      return { ...state, ...action.payload, isLoading: false }
    },
    [changeType.rejected.toString()]: (state, action) => {
      state.isLoading = false
      state.error = action.error.message
    },
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

export const { changeKeyword, changeDate } = homeSlice.actions

export default homeSlice.reducer
