import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  MapPin,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { ServiceItem, Appointment } from '../types';
import { getAttribution } from '../utils/attribution';
import { trackEvent } from '../utils/analytics';
import { BookingConfirmation } from './BookingConfirmation';
import { ImageWithFallback } from './ImageWithFallback';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialWeddingDate?: string;
}

type BookingStep = 1 | 2 | 3 | 4 | 5;

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialWeddingDate,
}) => {
  const [step, setStep] = useState<BookingStep>(1);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || 'srv-bridal-hd');

  // Dates
  const defaultConsultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const defaultWeddingDate = () => {
    if (initialWeddingDate) return initialWeddingDate;
    const d = new Date();
    d.setDate(d.getDate() + 35);
    return d.toISOString().split('T')[0];
  };

  const [weddingDate, setWeddingDate] = useState<string>(defaultWeddingDate());
  const [consultationDate, setConsultationDate] = useState<string>(defaultConsultDate());
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; available: boolean; reason?: string }>>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Qualification form fields
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState<string>('');
  const [sameAsPhone, setSameAsPhone] = useState<boolean>(true);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [weddingLocation, setWeddingLocation] = useState<string>('');
  const [functionsCount, setFunctionsCount] = useState<string>('2 Functions (Ceremony + Reception)');
  const [budgetRange, setBudgetRange] = useState<string>('$1,500 – $2,500');
  const [heardFrom, setHeardFrom] = useState<string>('Instagram Reel');
  const [bridalNotes, setBridalNotes] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [directWhatsAppUrl, setDirectWhatsAppUrl] = useState<string>('');

  // Fetch services on mount
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data: ServiceItem[]) => {
        setServices(data);
        if (initialServiceId) {
          setSelectedServiceId(initialServiceId);
        } else if (data.length > 0) {
          setSelectedServiceId(data[0].id);
        }
      })
      .catch(() => {});
  }, [initialServiceId]);

  // When initialWeddingDate changes, update
  useEffect(() => {
    if (initialWeddingDate) {
      setWeddingDate(initialWeddingDate);
      if (step === 1) setStep(2);
    }
  }, [initialWeddingDate]);

  // Fetch slots whenever consultationDate changes
  useEffect(() => {
    if (!consultationDate) return;
    setLoadingSlots(true);
    setSelectedTimeSlot('');
    setErrorMessage(null);

    fetch(`/api/availability/slots?date=${encodeURIComponent(consultationDate)}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.slots || []);
        setLoadingSlots(false);
      })
      .catch(() => {
        setLoadingSlots(false);
      });
  }, [consultationDate]);

  if (!isOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  // Submission Handler
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please enter your full name and phone number.');
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMessage('Please choose a consultation time slot.');
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    const attribution = getAttribution();

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_whatsapp: sameAsPhone ? customerPhone.trim() : (customerWhatsApp.trim() || customerPhone.trim()),
          customer_email: customerEmail.trim() || undefined,
          wedding_date: weddingDate,
          wedding_location: weddingLocation.trim() || 'Bay Area / Destination',
          appointment_date: consultationDate,
          start_time: selectedTimeSlot,
          service_id: selectedServiceId,
          service_name: currentService?.title || 'Bridal Consultation',
          appointment_type: 'Bridal Consultation',
          budget_range: budgetRange,
          functions_count: functionsCount,
          heard_from: heardFrom,
          notes: bridalNotes.trim(),
          ...attribution,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Double booking conflict or validation error
        setErrorMessage(data.error || 'Something went wrong while booking. Please try another time.');
        if (res.status === 409) {
          // Return to step 3 so bride picks another time
          setStep(3);
        }
        setIsSubmitting(false);
        return;
      }

      // Success!
      setConfirmedAppointment(data.appointment);
      setDirectWhatsAppUrl(data.directWhatsAppUrl);
      trackEvent('appointment_booked', { appointment_id: data.appointment.id });
      setStep(5);
    } catch {
      setErrorMessage('Network connection error. Please try again or tap WhatsApp below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      trackEvent('appointment_started', { service: selectedServiceId });
      setStep(2);
    } else if (step === 2) {
      if (!weddingDate) {
        setErrorMessage('Please select your wedding date.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedTimeSlot) {
        setErrorMessage('Please pick an available consultation time.');
        return;
      }
      setStep(4);
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    if (step > 1 && step < 5) {
      setStep((step - 1) as BookingStep);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#141210]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF8F5] w-full max-w-xl sm:rounded-none border border-[#DFD3C4] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden rounded-t-2xl sm:rounded-t-none">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-[#FAF8F5] border-b border-[#E8DFD5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && step < 5 && (
              <button
                type="button"
                onClick={prevStep}
                className="p-1 -ml-1 text-[#615C56] hover:text-[#1C1A18] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C6D45] font-semibold block">
                Bridal Reservation
              </span>
              <h3 className="font-serif text-lg font-medium text-[#1C1A18]">
                {step === 1 && '1. Choose Bridal Service'}
                {step === 2 && '2. Confirm Wedding Date'}
                {step === 3 && '3. Pick Consultation Time'}
                {step === 4 && '4. Bridal Lead Details'}
                {step === 5 && 'Confirmation'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#736B62] hover:text-[#1C1A18] min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Progress Indicator (Calendly-style minimal progress) */}
        {step < 5 && (
          <div className="bg-[#EFE8DC] h-1.5 w-full flex">
            <div
              className="bg-[#1C1A18] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-left">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-[#FFF2F2] border border-[#F5C2C2] text-[#992222] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#5A554E]">
                Select the primary service you are inquiring for. You can customize functions and trials during our call.
              </p>

              <div className="space-y-2.5">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3.5 sm:p-4 border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-[#1C1A18] bg-[#F2ECE3] shadow-sm'
                          : 'border-[#DFD3C4] bg-white hover:border-[#8C6D45]'
                      }`}
                    >
                      {/* Service Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 overflow-hidden border border-[#D8CEBF] bg-[#FAF5EE]">
                        <ImageWithFallback
                          src={srv.image_url}
                          alt={srv.title}
                          aspectRatioClass="aspect-square"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] uppercase tracking-wider text-[#8C6D45] font-semibold">
                            {srv.category}
                          </span>
                          {srv.is_popular && (
                            <span className="text-[9px] bg-[#E8DCB8] text-[#1C1A18] px-1.5 py-0.2 font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-sm sm:text-base font-medium text-[#1C1A18] truncate">
                          {srv.title}
                        </h4>
                        <p className="text-[11px] text-[#736B62]">
                          Starting from ${srv.starting_price} · {srv.duration_minutes} Mins
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#1C1A18] bg-[#1C1A18] text-white'
                            : 'border-[#CFC2B2] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Confirm Wedding Date & Location */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="modal-wedding-date" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1.5">
                  Your Wedding or Marquee Event Date *
                </label>
                <div className="relative">
                  <input
                    id="modal-wedding-date"
                    type="date"
                    value={weddingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full h-12 px-4 border border-[#CFC2B2] bg-white text-[#1C1A18] text-base focus:outline-none focus:border-[#1C1A18]"
                    required
                  />
                </div>
                <span className="text-[11px] text-[#736B62] block mt-1">
                  We check atelier booking capacity against this wedding date.
                </span>
              </div>

              <div>
                <label htmlFor="modal-wedding-location" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1.5">
                  Wedding City / Venue (Optional)
                </label>
                <div className="relative">
                  <input
                    id="modal-wedding-location"
                    type="text"
                    placeholder="e.g. San Francisco, Napa, Carmel, Destination"
                    value={weddingLocation}
                    onChange={(e) => setWeddingLocation(e.target.value)}
                    className="w-full h-12 px-4 border border-[#CFC2B2] bg-white text-[#1C1A18] text-sm focus:outline-none focus:border-[#1C1A18]"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF3EA] border border-[#E4D5BF] flex items-center gap-2.5 text-xs text-[#6B502C]">
                <Sparkles className="w-4 h-4 text-[#B89668] shrink-0" />
                <span>
                  Our team travels worldwide. We bring all luxury lighting, chairs, and sanitization kits.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Select Consultation Date & Time Slot */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="modal-consult-date" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1.5">
                  Select Consultation Date
                </label>
                <input
                  id="modal-consult-date"
                  type="date"
                  value={consultationDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setConsultationDate(e.target.value)}
                  className="w-full h-11 px-3 border border-[#CFC2B2] bg-white text-[#1C1A18] text-sm focus:outline-none focus:border-[#1C1A18]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#3D3833]">
                    Available Consultation Times:
                  </span>
                  <span className="text-[11px] text-[#8C6D45] font-medium">
                    30-Minute Video or Studio Call
                  </span>
                </div>

                {loadingSlots ? (
                  <div className="py-8 text-center text-xs text-[#736B62]">
                    Checking atelier schedule...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 bg-[#F7F2EB] border border-[#DFD3C4] text-xs text-[#5A554E] text-center">
                    No open consultation slots on this date. Please pick another date above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`min-h-[44px] px-3 py-2 text-xs font-mono font-medium rounded-none border transition-all flex items-center justify-center cursor-pointer ${
                            !slot.available
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#1C1A18] text-white border-[#1C1A18] font-bold shadow-sm'
                              : 'bg-white text-[#1C1A18] border-[#DFD3C4] hover:border-[#1C1A18]'
                          }`}
                        >
                          <span>{slot.time}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="text-[10px] text-[#736B62] mt-2">
                  Slots automatically update in real-time. Double-booking protected.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Personal Qualification Form */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label htmlFor="form-full-name" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="form-full-name"
                    type="text"
                    required
                    placeholder="e.g. Maya Patel"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-11 px-3 border border-[#CFC2B2] bg-white text-sm text-[#1C1A18] focus:outline-none focus:border-[#1C1A18]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="form-phone-number" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1">
                    Phone Number (Mobile) *
                  </label>
                  <input
                    id="form-phone-number"
                    type="tel"
                    required
                    placeholder="+1 (415) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-11 px-3 border border-[#CFC2B2] bg-white text-sm text-[#1C1A18] focus:outline-none focus:border-[#1C1A18]"
                  />
                </div>
              </div>

              {/* WhatsApp checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A453F]">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="w-4 h-4 text-[#1C1A18] border-[#CFC2B2] rounded-none cursor-pointer"
                  />
                  <span>WhatsApp number is the same as mobile phone</span>
                </label>

                {!sameAsPhone && (
                  <input
                    type="tel"
                    placeholder="Enter WhatsApp Number"
                    value={customerWhatsApp}
                    onChange={(e) => setCustomerWhatsApp(e.target.value)}
                    className="mt-2 w-full h-11 px-3 border border-[#CFC2B2] bg-white text-sm text-[#1C1A18] focus:outline-none focus:border-[#1C1A18]"
                  />
                )}
              </div>

              {/* Functions count chips */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1.5">
                  Expected Number of Functions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1 Ceremony', '2 Functions', '3+ Functions'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFunctionsCount(f)}
                      className={`min-h-[40px] py-2 px-2 text-xs border transition-all text-center ${
                        functionsCount === f
                          ? 'border-[#1C1A18] bg-[#1C1A18] text-white font-semibold'
                          : 'border-[#DFD3C4] bg-white text-[#4A453F] hover:border-[#1C1A18]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Approximate Budget */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1.5">
                  Approximate Beauty Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {['Under $1K', '$1K – $1.8K', '$1.8K – $2.5K', '$2.5K+'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetRange(b)}
                      className={`min-h-[40px] py-1.5 px-2 text-[11px] border transition-all text-center ${
                        budgetRange === b
                          ? 'border-[#1C1A18] bg-[#1C1A18] text-white font-semibold'
                          : 'border-[#DFD3C4] bg-white text-[#4A453F] hover:border-[#1C1A18]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* How did you find us */}
              <div>
                <label htmlFor="form-heard-from" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1">
                  How Did You Hear About Us?
                </label>
                <select
                  id="form-heard-from"
                  value={heardFrom}
                  onChange={(e) => setHeardFrom(e.target.value)}
                  className="w-full h-10 px-3 border border-[#CFC2B2] bg-white text-xs text-[#1C1A18] focus:outline-none focus:border-[#1C1A18]"
                >
                  <option value="Instagram Reel">Instagram Reel</option>
                  <option value="Instagram Ad">Instagram Sponsored Ad</option>
                  <option value="Facebook Ad">Facebook Ad</option>
                  <option value="Friend Referral">Friend or Past Bride Referral</option>
                  <option value="Wedding Planner">Wedding Planner Recommendation</option>
                  <option value="Google">Google Search</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="form-bridal-notes" className="block text-xs uppercase tracking-wider font-semibold text-[#3D3833] mb-1">
                  Special Notes, Vision or Veil Requirements
                </label>
                <textarea
                  id="form-bridal-notes"
                  rows={2}
                  placeholder="e.g. Heavy dupatta draping, sensitive skin, trial look request..."
                  value={bridalNotes}
                  onChange={(e) => setBridalNotes(e.target.value)}
                  className="w-full p-2.5 border border-[#CFC2B2] bg-white text-xs text-[#1C1A18] focus:outline-none focus:border-[#1C1A18]"
                />
              </div>

              {/* Hidden Meta Attribution Notice */}
              <div className="text-[10px] text-[#736B62] text-center pt-1">
                Your consultation request triggers direct WhatsApp confirmation & SMS alert.
              </div>
            </form>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && confirmedAppointment && (
            <BookingConfirmation
              appointment={confirmedAppointment}
              directWhatsAppUrl={directWhatsAppUrl}
              onClose={onClose}
            />
          )}

        </div>

        {/* Modal Bottom Footer / Next Action */}
        {step < 5 && (
          <div className="p-4 bg-[#F5EFEB] border-t border-[#E8DFD5] flex items-center justify-between shrink-0">
            <div className="text-xs text-[#615C56]">
              {step === 1 && `Service: ${currentService?.category || 'Bridal'}`}
              {step === 2 && `Wedding: ${weddingDate}`}
              {step === 3 && (selectedTimeSlot ? `Slot: ${selectedTimeSlot}` : 'Pick slot')}
              {step === 4 && 'Step 4 of 4: Finalize'}
            </div>

            <div className="flex items-center gap-2">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#1C1A18] hover:bg-[#332F2A] active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#1B431E] hover:bg-[#143317] active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Slot...</span>
                  ) : (
                    <>
                      <span>Complete Reservation</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
