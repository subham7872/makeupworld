import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';

interface AdminLeadsProps {
  leads: Lead[];
  onRefresh: () => void;
}

const ALL_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONSULTATION',
  'QUOTE_SENT',
  'FOLLOW_UP',
  'BOOKED',
  'LOST',
];

export const AdminLeads: React.FC<AdminLeadsProps> = ({ leads, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.wedding_date.includes(searchTerm) ||
      (lead.wedding_location && lead.wedding_location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingId(leadId);
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hi ${name}! This is Sanjana from Aura Bridal Atelier. I am following up on your bridal inquiry for your wedding day ❤️`
    );
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#736B62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by bride name, phone, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 border border-[#DFD3C4] bg-white text-xs text-[#1C1A18] focus:outline-none focus:border-[#1C1A18]"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#736B62]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 border border-[#DFD3C4] bg-white text-xs text-[#1C1A18] focus:outline-none focus:border-[#1C1A18]"
          >
            <option value="ALL">All Statuses ({leads.length})</option>
            {ALL_STATUSES.map((st) => {
              const count = leads.filter((l) => l.status === st).length;
              return (
                <option key={st} value={st}>
                  {st} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-[#DFD3C4] overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF5EE] border-b border-[#DFD3C4] text-[10px] uppercase tracking-wider text-[#736B62]">
              <th className="p-3 font-semibold">Bride Contact</th>
              <th className="p-3 font-semibold">Wedding Date & City</th>
              <th className="p-3 font-semibold">Service & Budget</th>
              <th className="p-3 font-semibold">Attribution (Ad Source)</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5]">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-[#736B62]">
                  No leads found matching your filters.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#FAF8F5] transition-colors">
                  
                  {/* Bride Contact */}
                  <td className="p-3">
                    <div className="font-semibold text-[#1C1A18]">{lead.name}</div>
                    <div className="font-mono text-[11px] text-[#736B62]">{lead.phone}</div>
                    {lead.email && <div className="text-[10px] text-[#8C6D45] truncate">{lead.email}</div>}
                  </td>

                  {/* Wedding Date & City */}
                  <td className="p-3">
                    <div className="font-serif font-medium text-[#1C1A18] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B89668]" />
                      <span>{lead.wedding_date}</span>
                    </div>
                    <div className="text-[11px] text-[#736B62]">{lead.wedding_location}</div>
                    <div className="text-[10px] text-[#8C6D45]">{lead.functions_count}</div>
                  </td>

                  {/* Service & Budget */}
                  <td className="p-3">
                    <div className="font-medium text-[#1C1A18]">{lead.service_category}</div>
                    <div className="text-[11px] text-[#2E7D32] font-medium">{lead.budget_range}</div>
                    {lead.preferred_package && (
                      <div className="text-[10px] text-[#736B62]">{lead.preferred_package}</div>
                    )}
                  </td>

                  {/* Attribution */}
                  <td className="p-3">
                    <span className="font-semibold text-[#1C1A18] block">
                      {lead.lead_source}
                    </span>
                    <span className="font-mono text-[10px] text-[#736B62] block truncate max-w-[150px]">
                      {lead.utm_campaign || 'direct'}
                    </span>
                    {lead.fbclid && (
                      <span className="text-[9px] text-[#B89668] bg-[#FAF5EE] px-1 py-0.5 rounded">
                        fbclid verified
                      </span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-3">
                    <select
                      value={lead.status}
                      disabled={updatingId === lead.id}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className={`text-[11px] font-semibold px-2 py-1 border transition-colors cursor-pointer ${
                        lead.status === 'NEW'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : lead.status === 'CONSULTATION'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : lead.status === 'BOOKED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : lead.status === 'LOST'
                          ? 'bg-slate-100 text-slate-600 border-slate-300'
                          : 'bg-[#FAF5EE] text-[#1C1A18] border-[#DFD3C4]'
                      }`}
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openWhatsApp(lead.phone, lead.name)}
                        className="p-1.5 text-[#1B5E20] hover:bg-[#E8F5E9] rounded transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 fill-[#2E7D32]" />
                      </button>
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-1.5 text-[#1C1A18] hover:bg-[#F2ECE3] rounded transition-colors"
                        title="Call Phone"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-[11px] text-[#8C6D45] hover:text-[#1C1A18] font-medium px-2 py-1"
                      >
                        Details
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Lead Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#DFD3C4] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C6D45] font-semibold">
                  CRM Lead Dossier
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1C1A18]">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs uppercase tracking-wider text-[#736B62] hover:text-[#1C1A18]"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-white p-3 border border-[#E8DFD5]">
                <div>
                  <span className="text-[10px] text-[#736B62] block">Phone / WhatsApp</span>
                  <span className="font-mono text-[#1C1A18]">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#736B62] block">Wedding Date</span>
                  <span className="font-serif font-semibold text-[#8C6D45]">{selectedLead.wedding_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#736B62] block">Location</span>
                  <span className="text-[#1C1A18]">{selectedLead.wedding_location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#736B62] block">Budget Range</span>
                  <span className="text-[#2E7D32] font-semibold">{selectedLead.budget_range}</span>
                </div>
              </div>

              {/* Attribution Meta */}
              <div className="bg-white p-3 border border-[#E8DFD5] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8C6D45] font-semibold block">
                  Campaign Attribution (Meta Ads / UTM)
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#4A453F]">
                  <div>Source: {selectedLead.utm_source || 'direct'}</div>
                  <div>Medium: {selectedLead.utm_medium || 'none'}</div>
                  <div className="col-span-2">Campaign: {selectedLead.utm_campaign || 'none'}</div>
                  {selectedLead.fbclid && (
                    <div className="col-span-2 text-[10px] text-[#736B62] break-all">
                      fbclid: {selectedLead.fbclid}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedLead.notes && (
                <div className="bg-white p-3 border border-[#E8DFD5] space-y-1">
                  <span className="text-[10px] uppercase text-[#736B62] block">Bride Notes</span>
                  <p className="text-xs text-[#1C1A18] whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => openWhatsApp(selectedLead.phone, selectedLead.name)}
                className="flex-1 py-2.5 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Open WhatsApp</span>
              </button>
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 py-2.5 bg-[#1C1A18] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Bride</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
