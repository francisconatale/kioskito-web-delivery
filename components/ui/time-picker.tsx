import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  // Manejamos el formato HH:mm:ss o HH:mm
  const valToSplit = value ? (value.length === 8 ? value.substring(0, 5) : value) : '09:00';
  const [hours, minutes] = valToSplit.split(':');

  const hoursList = useMemo(() => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), []);
  const minutesList = useMemo(() => ['00', '15', '30', '45'], []);

  const handleHourSelect = (h: string) => {
    onChange(`${h}:${minutes}`);
  };

  const handleMinuteSelect = (m: string) => {
    onChange(`${hours}:${m}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 border border-transparent",
            className
          )}
        >
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{valToSplit || '00:00'}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="center">
        <div className="flex h-64 divide-x">
          <div className="flex-1 flex flex-col">
            <div className="p-2 text-xs font-semibold text-center text-muted-foreground border-b bg-muted/50">Hora</div>
            <ScrollArea className="flex-1">
              <div className="p-1 space-y-1">
                {hoursList.map(h => (
                  <button
                    key={h}
                    onClick={() => handleHourSelect(h)}
                    className={cn(
                      "w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                      hours === h ? "bg-blue-600 text-white font-medium" : "hover:bg-neutral-100"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="p-2 text-xs font-semibold text-center text-muted-foreground border-b bg-muted/50">Min</div>
            <ScrollArea className="flex-1">
              <div className="p-1 space-y-1">
                {minutesList.map(m => (
                  <button
                    key={m}
                    onClick={() => handleMinuteSelect(m)}
                    className={cn(
                      "w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                      minutes === m ? "bg-blue-600 text-white font-medium" : "hover:bg-neutral-100"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
