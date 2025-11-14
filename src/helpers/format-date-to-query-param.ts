import { format } from 'date-fns'

export const formatDateToQueryParam = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}
