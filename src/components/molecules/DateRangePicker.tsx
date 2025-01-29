import { FC, useState } from 'react';
import { Button } from '../atoms/Button';
import { DateRange } from 'react-date-range';
import { Popover } from '@headlessui/react';
import { Icon } from '../atoms/Icon';
import { formatDate } from '@/utils/format';
import { addDays, endOfDay, startOfDay, subDays } from 'date-fns';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (range: [Date, Date]) => void;
  className?: string;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: value[0],
    endDate: value[1],
    key: 'selection'
  });

  const handleSelect = (ranges: any) => {
    setDateRange(ranges.selection);
    onChange([ranges.selection.startDate, ranges.selection.endDate]);
  };

  const handleToday = () => {
    const today = new Date();
    onChange([startOfDay(today), endOfDay(today)]);
  };

  const handleLast7Days = () => {
    const today = new Date();
    onChange([startOfDay(subDays(today, 6)), endOfDay(today)]);
  };

  const handleLast30Days = () => {
    const today = new Date();
    onChange([startOfDay(subDays(today, 29)), endOfDay(today)]);
  };

  return (
    <Popover className="relative">
      <Popover.Button as={Button} variant="outline" className={className}>
        <Icon name="CalendarIcon" className="w-5 h-5 mr-2" />
        {format(dateRange.startDate, 'dd/MM/yyyy')} - {format(dateRange.endDate, 'dd/MM/yyyy')}
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg">
        <div className="flex gap-2 p-2">
          <Button variant="outline" className="flex-1" onClick={handleToday}>
            Hôm nay
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleLast7Days}>
            7 ngày
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleLast30Days}>
            30 ngày
          </Button>
        </div>

        <DateRange
          ranges={[dateRange]}
          onChange={handleSelect}
          locale={vi}
          moveRangeOnFirstSelection={false}
        />
      </Popover.Panel>
    </Popover>
  );
}; 