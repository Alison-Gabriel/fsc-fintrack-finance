import { addMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'

import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export const DatePickerWithRange = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addMonths(new Date(), 1),
  })

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
          numberOfMonths={2}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}
