import React from 'react';
import { CheckCircle2, Calendar, MapPin, MessageSquare, Download, Share2, Sparkles } from 'lucide-react';
import { Appointment } from '../types';
import { trackEvent } from '../utils/analytics';

interface BookingConfirmationProps {
  appointment: Appointment;
  directWhatsAppUrl: string;
  onClose: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  appointment,
  directWhatsAppUrl,
  onClose,
}) => {
  const handleOpenWhatsApp = () => {
    trackEvent('whatsapp_clicked', { source: 'booking_confirmation' });
    window.open(directWhatsAppUrl, '_blank');
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Bridal Consultation: ${appointment.service_name} with Aura Atelier`);
    const details = encodeURIComponent(
      `Bridal consultation for ${appointment.customer_name}.\nWedding Date: ${appointment.wedding_date}\nPhone: ${appointment.customer_phone}\nLocation: ${appointment.location}`
    );
    const location = encodeURIComponent(appointment.location);

    // Format dates to YYYYMMDDTHHmmssZ
    // Appointment date is YYYY-MM-DD
    const cleanDate = appointment.appointment_date.replace(/-/g, '');
    const startTimeFormatted = `${cleanDate}T150000Z`;
    const endTimeFormatted = `${cleanDate}T160000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeFormatted}/${endTimeFormatted}&details=${details}&location=${location}`;
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aura Bridal Atelier//Bridal Consultation//EN
BEGIN:VEVENT
SUMMARY:Bridal Consultation with Aura Atelier
DESCRIPTION:Bespoke bridal styling consultation for ${appointment.customer_name}. Wedding date: ${appointment.wedding_date}
LOCATION:${appointment.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bridal-consultation-${appointment.appointment_date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-6 sm:py-8 px-4 text-center space-y-6 max-w-lg mx-auto animate-in zoom-in-95 duration-200">
      
      {/* Icon */}
      <div className="w-16 h-16 mx-auto rounded-full bg-[#F2F7F2] border border-[#B4D7B4] flex items-center justify-center text-[#2E7D32]">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      {/* Main Announcement */}
      <div className="space-y-2">
        <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#8C6D45] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B89668]" />
          <span>Appointment Reserved</span>
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#1C1A18] font-normal">
          You're Booked ❤️
        </h3>
        <p className="text-xs sm:text-sm text-[#5A554E]">
          Thank you <strong className="font-semibold text-[#1C1A18]">{appointment.customer_name}</strong>. Your bridal consultation has been securely recorded.
        </p>
      </div>

      {/* Appointment Summary Card */}
      <div className="bg-[#FAF8F5] border border-[#DFD3C4] p-5 text-left space-y-3 shadow-inner">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
          <span className="text-xs uppercase tracking-wider text-[#736B62] font-semibold">
            Consultation Details
          </span>
          <span className="text-xs font-mono font-medium text-[#2E7D32] bg-[#EAF5EA] px-2 py-0.5 rounded">
            CONFIRMED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase text-[#736B62] block">Consultation Date</span>
            <span className="font-semibold text-[#1C1A18]">{appointment.appointment_date}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#736B62] block">Time Slot</span>
            <span className="font-semibold text-[#1C1A18]">{appointment.start_time}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#736B62] block">Your Wedding Date</span>
            <span className="font-semibold text-[#8C6D45]">{appointment.wedding_date}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#736B62] block">Artist</span>
            <span className="font-semibold text-[#1C1A18]">Sanjana Roy (Lead)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E8DFD5] space-y-1">
          <span className="text-[10px] uppercase text-[#736B62] block">Service Requested</span>
          <p className="text-xs font-medium text-[#1C1A18]">{appointment.service_name}</p>
        </div>

        <div className="pt-1 flex items-start gap-1.5 text-xs text-[#615C56]">
          <MapPin className="w-3.5 h-3.5 text-[#B89668] shrink-0 mt-0.5" />
          <span>{appointment.location}</span>
        </div>
      </div>

      {/* Primary WhatsApp Action */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Chat on WhatsApp to Confirm Details</span>
        </button>

        {/* Calendar Sync Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 border border-[#D8CEBF] bg-white text-[#1C1A18] hover:bg-[#F2ECE3] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#8C6D45]" />
            <span>Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={handleDownloadICS}
            className="py-2.5 px-3 border border-[#D8CEBF] bg-white text-[#1C1A18] hover:bg-[#F2ECE3] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#8C6D45]" />
            <span>Download .iCal</span>
          </button>
        </div>
      </div>

      {/* Note & Back button */}
      <div className="pt-4 border-t border-[#E8DFD5] space-y-2">
        <p className="text-[11px] text-[#736B62]">
          A confirmation SMS & WhatsApp summary has also been triggered to {appointment.customer_phone}.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-wider font-semibold text-[#1C1A18] hover:text-[#8C6D45] transition-colors py-2"
        >
          Return to Atelier Homepage
        </button>
      </div>

    </div>
  );
};
