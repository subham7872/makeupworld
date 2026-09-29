import React, { useEffect, useState } from 'react';
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Percent,
  Sparkles,
  Instagram,
  Facebook,
  Compass,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { Lead, Appointment } from '../../types';

interface SummaryData {
  totalLeads: number;
  qualifiedLeads: number;
  totalAppointments: number;
  confirmedAppointments: number;
  confirmedBookings: number;
  leadToAptRate: number;
  aptToBookingRate: number;
  sourceBreakdown: Record<string, number>;
  campaignBreakdown: Record<string, number>;
}

interface AdminOverviewProps {
  leads: Lead[];
  appointments: Appointment[];
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  leads,
  appointments,
  onNavigateTab,
}) => {
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetch('/api/analytics/summary')
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch(() => {});
  }, [leads, appointments]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(
    (a) => a.appointment_date === todayStr && a.status === 'CONFIRMED'
  );

  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;
  const bookedCount = leads.filter((l) => l.status === 'BOOKED').length;
  const estimatedRevenue = bookedCount * 1550; // based on average package

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice */}
      <div className="p-4 bg-[#FAF5EE] border border-[#E2D5C5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1C1A18] text-[#E6DCB8] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1A18]">
              Atelier Inbound Conversion Pulse
            </h4>
            <p className="text-xs text-[#5A554E]">
              Real-time lead attribution active for Meta Ads (Instagram Reels, Facebook Feed) and Direct Bookings.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('leads')}
          className="text-xs font-semibold uppercase tracking-wider text-[#8C6D45] hover:text-[#1C1A18] flex items-center gap-1 transition-colors"
        >
          <span>View {newLeadsCount} New Inquiries</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Stat Cards (Single-level depth, clean typography) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 border border-[#DFD3C4] space-y-1">
          <div className="flex items-center justify-between text-[#736B62]">
            <span className="text-[11px] uppercase tracking-wider font-medium">Total Leads</span>
            <Users className="w-4 h-4 text-[#8C6D45]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#1C1A18] tabular-nums">
            {leads.length}
          </div>
          <span className="text-[11px] text-[#2E7D32] font-medium block">
            {summary?.qualifiedLeads || 0} Qualified Inquiries
          </span>
        </div>

        <div className="bg-white p-5 border border-[#DFD3C4] space-y-1">
          <div className="flex items-center justify-between text-[#736B62]">
            <span className="text-[11px] uppercase tracking-wider font-medium">Appointments</span>
            <CalendarCheck className="w-4 h-4 text-[#8C6D45]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#1C1A18] tabular-nums">
            {appointments.length}
          </div>
          <span className="text-[11px] text-[#736B62] block">
            {todaysAppointments.length} Scheduled for Today
          </span>
        </div>

        <div className="bg-white p-5 border border-[#DFD3C4] space-y-1">
          <div className="flex items-center justify-between text-[#736B62]">
            <span className="text-[11px] uppercase tracking-wider font-medium">Confirmed Bookings</span>
            <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#1C1A18] tabular-nums">
            {bookedCount}
          </div>
          <span className="text-[11px] text-[#8C6D45] font-medium block">
            ${estimatedRevenue.toLocaleString()} Pipeline Value
          </span>
        </div>

        <div className="bg-white p-5 border border-[#DFD3C4] space-y-1">
          <div className="flex items-center justify-between text-[#736B62]">
            <span className="text-[11px] uppercase tracking-wider font-medium">Conversion Rate</span>
            <Percent className="w-4 h-4 text-[#8C6D45]" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#1C1A18] tabular-nums">
            {summary?.leadToAptRate || 0}%
          </div>
          <span className="text-[11px] text-[#736B62] block">
            Lead-to-Appointment
          </span>
        </div>

      </div>

      {/* Attribution & Campaign Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Source Breakdown */}
        <div className="bg-white p-6 border border-[#DFD3C4] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-medium text-[#1C1A18]">
              Lead Acquisition Channels
            </h4>
            <span className="text-[10px] uppercase tracking-widest text-[#736B62]">
              UTM Tracked
            </span>
          </div>

          <div className="space-y-3">
            {summary?.sourceBreakdown &&
              Object.entries(summary.sourceBreakdown).map(([source, count]) => {
                const total = summary.totalLeads || 1;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={source} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-[#1C1A18]">
                        {source.toLowerCase().includes('instagram') ? (
                          <Instagram className="w-3.5 h-3.5 text-rose-600" />
                        ) : source.toLowerCase().includes('facebook') ? (
                          <Facebook className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Compass className="w-3.5 h-3.5 text-[#8C6D45]" />
                        )}
                        <span>{source}</span>
                      </span>
                      <span className="font-mono text-xs text-[#736B62] tabular-nums">
                        {count} leads ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF5EE] h-2 rounded-full overflow-hidden border border-[#E8DFD5]">
                      <div
                        className="bg-[#1C1A18] h-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Campaign Breakdown */}
        <div className="bg-white p-6 border border-[#DFD3C4] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-medium text-[#1C1A18]">
              Top Meta Ad Campaigns
            </h4>
            <span className="text-[10px] uppercase tracking-widest text-[#736B62]">
              utm_campaign
            </span>
          </div>

          <div className="space-y-3">
            {summary?.campaignBreakdown &&
              Object.entries(summary.campaignBreakdown).map(([campaign, count]) => (
                <div
                  key={campaign}
                  className="p-3 bg-[#FAF8F5] border border-[#E8DFD5] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono text-[#1C1A18] font-medium">{campaign}</div>
                    <div className="text-[10px] text-[#736B62]">
                      Targeting high-intent bridal brides
                    </div>
                  </div>
                  <div className="font-serif text-lg font-semibold text-[#8C6D45] tabular-nums">
                    {count}
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* Today's Appointments Quick View */}
      <div className="bg-white p-6 border border-[#DFD3C4] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg font-medium text-[#1C1A18]">
            Today's Consultations ({todaysAppointments.length})
          </h4>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs uppercase tracking-wider font-semibold text-[#8C6D45] hover:text-[#1C1A18] transition-colors"
          >
            Open Full Calendar →
          </button>
        </div>

        {todaysAppointments.length === 0 ? (
          <div className="p-6 bg-[#FAF8F5] border border-dashed border-[#DFD3C4] text-center text-xs text-[#736B62]">
            No consultations scheduled for today ❤️
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 border border-[#DFD3C4] bg-[#FAF8F5] flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#B89668]" />
                    <span className="font-mono text-xs font-semibold text-[#1C1A18]">
                      {apt.start_time} – {apt.end_time}
                    </span>
                  </div>
                  <h5 className="font-serif text-base text-[#1C1A18] font-medium">
                    {apt.customer_name}
                  </h5>
                  <p className="text-[11px] text-[#736B62]">
                    Wedding: {apt.wedding_date} · {apt.service_name}
                  </p>
                </div>

                <a
                  href={`tel:${apt.customer_phone}`}
                  className="px-3 py-1.5 bg-[#1C1A18] text-white text-xs font-medium uppercase tracking-wider"
                >
                  Call
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
