import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Lock, Unlock, XCircle, CheckCircle, MapPin, User } from 'lucide-react';
import { Appointment, BusinessAvailability } from '../../types';

interface AdminCalendarProps {
  appointments: Appointment[];
  availability: BusinessAvailability;
  onRefresh: () => void;
}

export const AdminCalendar: React.FC<AdminCalendarProps> = ({
  appointments,
  availability,
  onRefresh,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [activeDate, setActiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [blockingDate, setBlockingDate] = useState<string>('');

  // Days in month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 is Sunday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleToggleBlockDate = async (dateStr: string) => {
    const isCurrentlyBlocked = availability.blockedDates.includes(dateStr);
    let newBlocked = [...availability.blockedDates];

    if (isCurrentlyBlocked) {
      newBlocked = newBlocked.filter((d) => d !== dateStr);
    } else {
      newBlocked.push(dateStr);
    }

    try {
      await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedDates: newBlocked }),
      });
      onRefresh();
    } catch {}
  };

  const handleCancelAppointment = async (aptId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await fetch(`/api/appointments/${aptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      onRefresh();
    } catch {}
  };

  // Get appointments for the actively selected date
  const appointmentsForActiveDate = appointments.filter(
    (a) => a.appointment_date === activeDate && a.status !== 'CANCELLED'
  );

  const isDateBlocked = availability.blockedDates.includes(activeDate);

  return (
    <div className="space-y-6">
      
      {/* Calendar Top Header */}
      <div className="bg-white p-5 border border-[#DFD3C4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-medium text-[#1C1A18]">
            {monthNames[selectedMonth]} {selectedYear}
          </h3>
          <p className="text-xs text-[#736B62]">
            Atelier Booking & Availability Schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1.5 border border-[#DFD3C4] bg-[#FAF8F5] text-xs font-semibold hover:border-[#1C1A18] transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={() => {
              const now = new Date();
              setSelectedMonth(now.getMonth());
              setSelectedYear(now.getFullYear());
              setActiveDate(now.toISOString().split('T')[0]);
            }}
            className="px-3 py-1.5 border border-[#DFD3C4] bg-[#FAF8F5] text-xs font-semibold hover:border-[#1C1A18] transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1.5 border border-[#DFD3C4] bg-[#FAF8F5] text-xs font-semibold hover:border-[#1C1A18] transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Grid: Calendar on Left, Selected Date Appointments on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Month Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#DFD3C4] p-4 sm:p-5">
          {/* Day of week labels */}
          <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-wider font-semibold text-[#736B62] pb-3 border-b border-[#E8DFD5]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {/* Blank leading slots */}
            {[...Array(firstDayOfWeek)].map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[64px] bg-[#FAF8F5]/40 border border-transparent" />
            ))}

            {/* Days in Month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayAppointments = appointments.filter(
                (a) => a.appointment_date === dateStr && a.status !== 'CANCELLED'
              );
              const isBlocked = availability.blockedDates.includes(dateStr);
              const isFullyBooked = availability.fullyBookedDates.includes(dateStr);
              const isSelected = activeDate === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setActiveDate(dateStr)}
                  className={`min-h-[64px] p-1.5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1C1A18] bg-[#F2ECE3] shadow-inner'
                      : isBlocked
                      ? 'border-rose-200 bg-rose-50/50'
                      : isFullyBooked
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-[#E8DFD5] bg-white hover:border-[#8C6D45]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-semibold ${isSelected ? 'text-[#1C1A18]' : 'text-[#4A453F]'}`}>
                      {dayNum}
                    </span>
                    {isBlocked && (
                      <span title="Date Blocked">
                        <Lock className="w-3 h-3 text-rose-500" />
                      </span>
                    )}
                  </div>

                  {/* Indicators */}
                  <div className="space-y-0.5">
                    {dayAppointments.length > 0 && (
                      <span className="text-[9px] bg-[#1C1A18] text-white px-1 py-0.2 rounded font-medium block truncate">
                        {dayAppointments.length} Booked
                      </span>
                    )}
                    {isBlocked && (
                      <span className="text-[9px] text-rose-700 font-medium block">
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-4 mt-4 border-t border-[#E8DFD5] flex flex-wrap items-center gap-4 text-[11px] text-[#736B62]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-white border border-[#DFD3C4] inline-block" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#1C1A18] inline-block" />
              <span>Booked Appointment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-rose-100 border border-rose-300 inline-block" />
              <span>Blocked Date</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#DFD3C4] p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8C6D45] font-semibold block">
                Schedule For
              </span>
              <h4 className="font-serif text-xl font-medium text-[#1C1A18]">
                {activeDate}
              </h4>
            </div>

            <button
              onClick={() => handleToggleBlockDate(activeDate)}
              className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border flex items-center gap-1 transition-colors ${
                isDateBlocked
                  ? 'border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]'
                  : 'border-rose-400 text-rose-700 hover:bg-rose-50'
              }`}
            >
              {isDateBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isDateBlocked ? 'Unblock Date' : 'Block Date'}</span>
            </button>
          </div>

          {/* List of bookings on this date */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-wider font-semibold text-[#3D3833]">
              Consultations ({appointmentsForActiveDate.length})
            </h5>

            {appointmentsForActiveDate.length === 0 ? (
              <div className="p-6 bg-[#FAF8F5] border border-dashed border-[#DFD3C4] text-center text-xs text-[#736B62]">
                No appointments booked on this date.
              </div>
            ) : (
              appointmentsForActiveDate.map((apt) => (
                <div key={apt.id} className="p-3.5 bg-[#FAF8F5] border border-[#DFD3C4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#1C1A18] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B89668]" />
                      <span>{apt.start_time} – {apt.end_time}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                      {apt.status}
                    </span>
                  </div>

                  <div>
                    <h6 className="font-serif text-base font-semibold text-[#1C1A18]">
                      {apt.customer_name}
                    </h6>
                    <p className="text-[11px] text-[#736B62]">{apt.customer_phone}</p>
                    <p className="text-[11px] text-[#8C6D45]">{apt.service_name}</p>
                    <p className="text-[10px] text-[#736B62]">Wedding Date: {apt.wedding_date}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between">
                    <a
                      href={`tel:${apt.customer_phone}`}
                      className="text-xs text-[#1C1A18] font-medium hover:underline"
                    >
                      Call Bride
                    </a>
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Cancel Slot
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Block Date form */}
          <div className="pt-4 border-t border-[#E8DFD5] space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#3D3833] block">
              Block Custom Holiday / Event Date
            </span>
            <div className="flex gap-2">
              <input
                type="date"
                value={blockingDate}
                onChange={(e) => setBlockingDate(e.target.value)}
                className="flex-1 h-9 px-2 text-xs border border-[#CFC2B2] bg-white text-[#1C1A18]"
              />
              <button
                type="button"
                disabled={!blockingDate}
                onClick={() => {
                  handleToggleBlockDate(blockingDate);
                  setBlockingDate('');
                }}
                className="px-3 h-9 bg-[#1C1A18] text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                Block
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
