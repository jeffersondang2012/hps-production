import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  className?: string;
}

export const DatePicker = ({
  selected,
  onChange,
  placeholderText,
  minDate,
  maxDate,
  className
}: DatePickerProps) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      placeholderText={placeholderText}
      minDate={minDate || undefined}
      maxDate={maxDate || undefined}
      className={className}
      dateFormat="dd/MM/yyyy"
      locale={vi}
      isClearable
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={10}
    />
  );
}; 