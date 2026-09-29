import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  MessageSquare,
  Network,
  ArrowLeft,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Lead, Appointment, BusinessAvailability } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminLeads } from './AdminLeads';
import { AdminCalendar } from './AdminCalendar';
import { AdminAvailability } from './AdminAvailability';
import { AdminAutomations } from './AdminAutomations';
import { AdminWebhooks } from './AdminWebhooks';

interface AdminDashboardProps {
  onClose: () => void;
}

type AdminTab = 'overview' | 'leads' | 'calendar' | 'availability' | 'automations' | 'webhooks';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<BusinessAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/leads').then((r) => r.json()),
      fetch('/api/appointments').then((r) => r.json()),
      fetch('/api/availability').then((r) => r.json()),
    ])
      .then(([l, a, av]) => {
        setLeads(l);
        setAppointments(a);
        setAvailability(av);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A18] pb-16">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DFD3C4] px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1 text-[#615C56] hover:text-[#1C1A18] transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Bride Website</span>
          </button>

          <div className="h-4 w-px bg-[#E8DFD5] hidden sm:block" />

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8C6D45]">
                Atelier Control Center
              </span>
              <span className="text-[9px] bg-[#FAF5EE] text-[#8C6D45] border border-[#E2D5C5] px-1.5 py-0.2 font-mono">
                CRM v2.4
              </span>
            </div>
            <h1 className="font-serif text-lg font-medium text-[#1C1A18]">
              Sanjana Roy — Bridal Appointments & Lead Management
            </h1>
          </div>
        </div>

        <button
          onClick={fetchAll}
          disabled={loading}
          className="p-2 text-[#736B62] hover:text-[#1C1A18] transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Admin Tab Navigation Bar */}
      <div className="bg-white border-b border-[#E8DFD5] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#1C1A18] text-[#1C1A18]'
                : 'border-transparent text-[#736B62] hover:text-[#1C1A18]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'leads'
                ? 'border-[#1C1A18] text-[#1C1A18]'
                : 'border-transparent text-[#736B62] hover:text-[#1C1A18]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leads CRM ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-[#1C1A18] text-[#1C1A18]'
                : 'border-transparent text-[#736B62] hover:text-[#1C1A18]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'availability'
                ? 'border-[#1C1A18] text-[#1C1A18]'
                : 'border-transparent text-[#736B62] hover:text-[#1C1A18]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hours & Buffers</span>
          </button>

          <button
            onClick={() => setActiveTab('automations')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'automations'
                ? 'border-[#1C1A18] text-[#1C1A18]'
                : 'border-transparent text-[#736B62] hover:text-[#1C1A18]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Follow-ups</span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'webhooks'
                ? 'border-[#1C1A18] text-[#1C1A18]'
                : 'border-transparent text-[#736B62] hover:text-[#1C1A18]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>FlowmaticAI Webhooks</span>
          </button>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {loading && (
          <div className="py-12 text-center text-xs text-[#736B62]">
            Loading atelier data...
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'overview' && (
              <AdminOverview
                leads={leads}
                appointments={appointments}
                onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
              />
            )}

            {activeTab === 'leads' && (
              <AdminLeads leads={leads} onRefresh={fetchAll} />
            )}

            {activeTab === 'calendar' && availability && (
              <AdminCalendar
                appointments={appointments}
                availability={availability}
                onRefresh={fetchAll}
              />
            )}

            {activeTab === 'availability' && availability && (
              <AdminAvailability
                availability={availability}
                onRefresh={fetchAll}
              />
            )}

            {activeTab === 'automations' && <AdminAutomations />}

            {activeTab === 'webhooks' && <AdminWebhooks />}
          </>
        )}
      </main>

    </div>
  );
};
