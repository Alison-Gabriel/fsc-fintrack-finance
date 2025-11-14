'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value: Date
  onChange: Dispatch<SetStateAction<Date | undefined>>
  placeholder?: string
}

export const DatePicker = ({ value: date, onChange: setDate, placeholder = 'Selecione uma data' }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          {date ? format(date, 'PPP', { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} locale={ptBR} />
      </PopoverContent>
    </Popover>
  )
}
