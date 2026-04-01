'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateCalendarGrid, getSessionsForDate, isToday } from '@/lib/session-utils';
import { SESSION_STATUS_COLORS, SESSION_TYPE_COLORS } from '@/lib/session-utils';

interface Session {
  id: string;
  sessionDate: Date;
  type: string;
  status: string;
  duration: number;
  case: {
    id: string;
    caseNumber: string;
    title: string;
  };
}

interface CalendarGridProps {
  sessions: Session[];
  onDateClick?: (date: Date, sessions: Session[]) => void;
  onSessionClick?: (session: Session) => void;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function CalendarGrid({ sessions, onDateClick, onSessionClick }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = generateCalendarGrid(year, month);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-primary">
          {MONTH_NAMES[month]} {year}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {calendarDays.map((date, idx) => {
            const daySessions = getSessionsForDate(sessions, date);
            const isCurrentMonth = date.getMonth() === month;
            const isTodayDate = isToday(date);

            return (
              <div
                key={idx}
                onClick={() => onDateClick && onDateClick(date, daySessions)}
                className={`
                  min-h-[100px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`
                      text-sm font-medium
                      ${isTodayDate ? 'flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full' : ''}
                      ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                    `}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Sessions for this day */}
                <div className="space-y-1">
                  {daySessions.slice(0, 3).map((session) => (
                    <button
                      key={session.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSessionClick && onSessionClick(session);
                      }}
                      className={`
                        w-full text-left px-2 py-1 rounded text-xs truncate
                        ${SESSION_STATUS_COLORS[session.status as keyof typeof SESSION_STATUS_COLORS]}
                        hover:opacity-80 transition-opacity
                      `}
                      title={`${format(new Date(session.sessionDate), 'HH:mm')} - ${session.case.caseNumber}`}
                    >
                      {format(new Date(session.sessionDate), 'HH:mm')}
                    </button>
                  ))}
                  {daySessions.length > 3 && (
                    <div className="text-xs text-gray-500 pl-2">
                      +{daySessions.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-600 font-medium">Legenda:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-100"></div>
            <span className="text-gray-600">Agendada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-100"></div>
            <span className="text-gray-600">Concluída</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-100"></div>
            <span className="text-gray-600">Cancelada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-100"></div>
            <span className="text-gray-600">Reagendada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
