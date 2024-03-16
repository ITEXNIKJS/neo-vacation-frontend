import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { differenceInCalendarDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";

export function DatePickerWithRange(
  props: React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
    date: DateRange;
    setDate: (date: DateRange | undefined) => void;
  }
) {
  const { className, date, setDate } = props;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={
              date?.to &&
              date.from &&
              differenceInCalendarDays(date.to, date.from) <= 20
                ? "success"
                : "dark"
            }
            left_icon={<CalendarIcon className="mr-2 h-5 w-5" />}
            className={cn("w-[300px] justify-center text-center h-14")}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd.MM.yyyy", { locale: ru })} -{" "}
                  {format(date.to, "dd.MM.yyyy", { locale: ru })}
                </>
              ) : (
                format(date.from, "dd.MM.yyyy", { locale: ru })
              )
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            max={21}
            fromDate={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
