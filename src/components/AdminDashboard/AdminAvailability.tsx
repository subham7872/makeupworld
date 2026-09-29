import React, { useState } from 'react';
import { Save, Check, Clock, ShieldAlert } from 'lucide-react';
import { BusinessAvailability, DaySchedule } from '../../types';

interface AdminAvailabilityProps {
  availability: BusinessAvailability;
  onRefresh: () => void;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export const AdminAvailability: React.FC<AdminAvailabilityProps> = ({
  availability,
  onRefresh,
}) => {
  const [config, setConfig] = useState<BusinessAvailability>(availability);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleDayToggle = (day: typeof DAYS[number]) => {
    setConfig((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          isOpen: !prev.businessHours[day].isOpen,
        },
      },
    }));
  };

  const handleTimeChange = (
    day: typeof DAYS[number],
    field: keyof DaySchedule,
    value: any
  ) => {
    setConfig((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // error handling
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 border border-[#DFD3C4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-medium text-[#1C1A18]">
            Atelier Availability & Operating Hours
          </h3>
          <p className="text-xs text-[#736B62]">
            Controls the real-time slot generation for bride appointments. Double-booking protection operates against these hours.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#1C1A18] hover:bg-[#332F2A] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#E6DCB8]" />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      {/* Global Buffer & Duration Settings */}
      <div className="bg-white p-5 border border-[#DFD3C4] grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1">
            Consultation Slot Duration (Minutes)
          </label>
          <select
            value={config.slotDurationMinutes}
            onChange={(e) => setConfig({ ...config, slotDurationMinutes: Number(e.target.value) })}
            className="w-full h-10 px-3 border border-[#CFC2B2] bg-white text-xs text-[#1C1A18]"
          >
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes (Recommended)</option>
            <option value={60}>60 Minutes</option>
            <option value={90}>90 Minutes (Full Trial)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1">
            Buffer Time Between Appointments (Minutes)
          </label>
          <select
            value={config.bufferMinutes}
            onChange={(e) => setConfig({ ...config, bufferMinutes: Number(e.target.value) })}
            className="w-full h-10 px-3 border border-[#CFC2B2] bg-white text-xs text-[#1C1A18]"
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes (Recommended)</option>
            <option value={45}>45 Minutes</option>
          </select>
        </div>
      </div>

      {/* Day by Day Schedule Rows */}
      <div className="bg-white border border-[#DFD3C4] divide-y divide-[#E8DFD5]">
        {DAYS.map((day) => {
          const schedule = config.businessHours[day];

          return (
            <div key={day} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Day title & open toggle */}
              <div className="flex items-center gap-3 w-44">
                <input
                  type="checkbox"
                  id={`toggle-${day}`}
                  checked={schedule.isOpen}
                  onChange={() => handleDayToggle(day)}
                  className="w-4 h-4 text-[#1C1A18] rounded cursor-pointer"
                />
                <label
                  htmlFor={`toggle-${day}`}
                  className="text-xs uppercase tracking-wider font-semibold text-[#1C1A18] cursor-pointer capitalize"
                >
                  {day}
                </label>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    schedule.isOpen ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {schedule.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              {/* Times */}
              {schedule.isOpen ? (
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#736B62] text-[11px]">Hours:</span>
                    <input
                      type="time"
                      value={schedule.openTime}
                      onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                      className="h-8 px-2 border border-[#CFC2B2] bg-white text-xs"
                    />
                    <span className="text-[#736B62]">to</span>
                    <input
                      type="time"
                      value={schedule.closeTime}
                      onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                      className="h-8 px-2 border border-[#CFC2B2] bg-white text-xs"
                    />
                  </div>

                  {/* Lunch break */}
                  <div className="flex items-center gap-1.5 pl-0 sm:pl-3 sm:border-l border-[#E8DFD5]">
                    <input
                      type="checkbox"
                      id={`break-${day}`}
                      checked={schedule.hasBreak}
                      onChange={(e) => handleTimeChange(day, 'hasBreak', e.target.checked)}
                      className="w-3.5 h-3.5 text-[#1C1A18]"
                    />
                    <label htmlFor={`break-${day}`} className="text-[#736B62] text-[11px] cursor-pointer">
                      Lunch Break:
                    </label>
                    {schedule.hasBreak && (
                      <div className="flex items-center gap-1">
                        <input
                          type="time"
                          value={schedule.breakStart || '13:00'}
                          onChange={(e) => handleTimeChange(day, 'breakStart', e.target.value)}
                          className="h-8 px-2 border border-[#CFC2B2] bg-white text-xs"
                        />
                        <span className="text-[#736B62]">-</span>
                        <input
                          type="time"
                          value={schedule.breakEnd || '14:00'}
                          onChange={(e) => handleTimeChange(day, 'breakEnd', e.target.value)}
                          className="h-8 px-2 border border-[#CFC2B2] bg-white text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#736B62] italic">
                  Studio closed. No appointments can be booked on this day.
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
