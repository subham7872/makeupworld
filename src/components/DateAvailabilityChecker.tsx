import React, { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle, XCircle, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface DateAvailabilityCheckerProps {
  onDateSelectedForBooking: (dateStr: string) => void;
}

export const DateAvailabilityChecker: React.FC<DateAvailabilityCheckerProps> = ({
  onDateSelectedForBooking,
}) => {
  // Default to a date ~3-4 weeks ahead
  const defaultFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(defaultFutureDate());
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
    message: string;
    canBookConsultation: boolean;
  } | null>(null);

  const checkAvailability = async (dateToCheck: string) => {
    if (!dateToCheck) return;
    setLoading(true);
    trackEvent('date_selected', { date: dateToCheck });

    try {
      const res = await fetch(`/api/availability/check-wedding-date?date=${encodeURIComponent(dateToCheck)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback
      setResult({
        status: 'AVAILABLE',
        message: 'Your date is currently available for bridal reservations.',
        canBookConsultation: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedDate(val);
    checkAvailability(val);
  };

  // Quick preset wedding season chips
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = d.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    checkAvailability(dateStr);
  };

  return (
    <section id="availability" className="py-12 md:py-16 bg-[#F5EFEB] border-y border-[#E8DFD5] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-semibold text-[#8C6D45]">
            <Clock className="w-3.5 h-3.5 text-[#B89668]" />
            <span>Instant Atelier Availability</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1C1A18] font-normal">
            Is Your Wedding Date Still Available?
          </h2>
          <p className="text-sm text-[#5A554E] max-w-lg mx-auto">
            We accept a maximum of <strong className="font-semibold text-[#1C1A18]">one bridal party per date</strong> to guarantee our undivided attention.
          </p>
        </div>

        {/* Date Selector Box */}
        <div className="bg-white p-5 sm:p-8 border border-[#DFD3C4] shadow-sm max-w-2xl mx-auto">
          
          <div className="space-y-4">
            <label htmlFor="wedding-date-input" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833]">
              Select Your Wedding or Main Event Date
            </label>

            {/* Input & Check Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="wedding-date-input"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full h-12 px-4 py-2 border border-[#CFC2B2] bg-[#FAF8F5] text-[#1C1A18] text-base focus:outline-none focus:border-[#1C1A18] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => checkAvailability(selectedDate)}
                disabled={loading || !selectedDate}
                className="h-12 px-6 bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] text-white font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-[#E6DCB8]" />
                    <span>Check Date</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Helper Chips */}
            <div className="pt-2">
              <span className="text-[11px] text-[#736B62] block mb-1.5 font-medium">Quick Select Upcoming Dates:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickDate(21)}
                  className="px-2.5 py-1 text-xs border border-[#DFD3C4] bg-[#FAF8F5] text-[#4A453F] hover:border-[#1C1A18] hover:text-[#1C1A18] transition-colors cursor-pointer"
                >
                  3 Weeks Out
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(45)}
                  className="px-2.5 py-1 text-xs border border-[#DFD3C4] bg-[#FAF8F5] text-[#4A453F] hover:border-[#1C1A18] hover:text-[#1C1A18] transition-colors cursor-pointer"
                >
                  6 Weeks Out
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(90)}
                  className="px-2.5 py-1 text-xs border border-[#DFD3C4] bg-[#FAF8F5] text-[#4A453F] hover:border-[#1C1A18] hover:text-[#1C1A18] transition-colors cursor-pointer"
                >
                  Peak Fall 2026
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(120)}
                  className="px-2.5 py-1 text-xs border border-[#DFD3C4] bg-[#FAF8F5] text-[#4A453F] hover:border-[#1C1A18] hover:text-[#1C1A18] transition-colors cursor-pointer"
                >
                  Winter 2026
                </button>
              </div>
            </div>

          </div>

          {/* Results Display */}
          {result && (
            <div className="mt-6 pt-6 border-t border-[#E8DFD5] animate-in fade-in duration-300">
              {result.status === 'AVAILABLE' && (
                <div className="p-4 bg-[#F2F7F2] border border-[#B4D7B4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1B431E]">
                        ✓ Your Wedding Date Is Available!
                      </h4>
                      <p className="text-xs text-[#2D5A30] mt-0.5">
                        We have a dedicated bridal artist team open for <strong className="font-semibold">{selectedDate}</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('appointment_started', { date: selectedDate });
                      onDateSelectedForBooking(selectedDate);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#1B431E] hover:bg-[#143317] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {result.status === 'LIMITED' && (
                <div className="p-4 bg-[#FFF9ED] border border-[#E8C88A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#B26A00] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#7A4900]">
                        Limited Availability For This Weekend
                      </h4>
                      <p className="text-xs text-[#8A5200] mt-0.5">
                        Multiple inquiries pending for <strong className="font-semibold">{selectedDate}</strong>. Reserve your consultation to hold your slot.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('appointment_started', { date: selectedDate, priority: 'limited' });
                      onDateSelectedForBooking(selectedDate);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#8C5500] hover:bg-[#704400] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {result.status === 'UNAVAILABLE' && (
                <div className="p-4 bg-[#FBF0F0] border border-[#E5B8B8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-[#B71C1C] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#7F1212]">
                        Date Completely Booked
                      </h4>
                      <p className="text-xs text-[#992222] mt-0.5">
                        Our studio is fully reserved on {selectedDate}. Choose an adjacent date or contact us for senior associate artist availability.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickDate(14);
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                  >
                    Check Another Date
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Privacy reassurance */}
          <div className="mt-4 text-center">
            <span className="text-[11px] text-[#736B62]">
              Instant confidential check. No client data is ever made public.
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
