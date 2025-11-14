import { useQueryClient } from '@tanstack/react-query'
import { addMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type DateRange } from 'react-day-picker'
import { useNavigate, useSearchParams } from 'react-router'

import { Calendar } from '@/components/ui/calendar'
import { useAuthContext } from '@/context/auth'
import { formatDateToQueryParam } from '@/helpers/format-date-to-query-param'

import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export const DateSelector = () => {
  const queryClient = useQueryClient()

  const { user } = useAuthContext()

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [dateRange, setDateRange] = useState<DateRange>({
    from: searchParams.get('from') ? new Date(searchParams.get('from') + 'T00:00:00') : new Date(),
    to: searchParams.get('to') ? new Date(searchParams.get('to') + 'T00:00:00') : addMonths(new Date(), 1),
  })

  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return

    const queryParams = new URLSearchParams()

    if (dateRange.from && dateRange.to) {
      queryParams.set('from', formatDateToQueryParam(dateRange.from))
      queryParams.set('to', formatDateToQueryParam(dateRange.to))

      navigate(`/?${queryParams.toString()}`)
      queryClient.invalidateQueries({
        queryKey: ['balance', user?.id],
      })
    }
  }, [dateRange, navigate, queryClient, user?.id])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!dateRange}
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          {format(String(dateRange.from), 'LLL dd, y', {
            locale: ptBR,
          })}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          required
          mode="range"
          defaultMonth={dateRange.from}
          selected={dateRange}
          onSelect={setDateRange}
          locale={ptBR}
          numberOfMonths={2}
          className="rounded-lg shadow-sm"
        />
      </PopoverContent>
    </Popover>
  )
}
