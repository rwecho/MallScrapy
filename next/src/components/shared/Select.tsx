import { Select as HtmlSelect } from '@chakra-ui/react'
import { ChangeEvent } from 'react'

type SelectProps<T> = {
  items: T[]
  onChange?: (value: any) => void
  value?: string
  placeholder?: string
  valueMember: (t: T) => string
  textMember: (t: T) => string
}

export const Select = <T extends object | string>(props: SelectProps<T>) => {
  const { items, onChange, value, placeholder, valueMember, textMember } = props

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(e.target.value)
  }

  return (
    <HtmlSelect onChange={handleChange} value={value} placeholder={placeholder}>
      {items.map((item, index) => (
        <option key={index} value={valueMember(item)}>
          {textMember(item)}
        </option>
      ))}
    </HtmlSelect>
  )
}
