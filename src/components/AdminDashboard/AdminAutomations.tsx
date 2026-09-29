import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Check, Bell, ToggleLeft, ToggleRight, Save, Send } from 'lucide-react';
import { FollowUpCampaign, WhatsAppNotification } from '../../types';

export const AdminAutomations: React.FC = () => {
  const [campaigns, setCampaigns] = useState<FollowUpCampaign[]>([]);
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/followups')
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch(() => {});

    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => {});
  }, []);

  const handleToggle = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await fetch('/api/followups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaigns),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {}
    finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Follow-up Sequence Configuration */}
      <div className="bg-white p-6 border border-[#DFD3C4] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#1C1A18]">
              Automated Bridal Follow-up Sequences
            </h3>
            <p className="text-xs text-[#736B62]">
              Configurable WhatsApp and Email drip messages to engage inquiries before peak wedding dates fill up.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#1C1A18] hover:bg-[#332F2A] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#E6DCB8]" />
                <span>Save Sequences</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className={`p-4 border transition-colors ${
                camp.enabled ? 'border-[#DFD3C4] bg-[#FAF8F5]' : 'border-slate-200 bg-slate-50 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {camp.channel === 'whatsapp' ? (
                    <MessageSquare className="w-4 h-4 text-[#2E7D32]" />
                  ) : (
                    <Mail className="w-4 h-4 text-[#8C6D45]" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1A18]">
                    {camp.delay_label}
                  </span>
                  <span className="text-[10px] text-[#736B62]">
                    ({camp.subject_or_hook})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(camp.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <span className={camp.enabled ? 'text-[#2E7D32]' : 'text-slate-400'}>
                    {camp.enabled ? 'Active' : 'Disabled'}
                  </span>
                  {camp.enabled ? (
                    <ToggleRight className="w-6 h-6 text-[#2E7D32]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                </button>
              </div>

              <p className="text-xs text-[#4A453F] font-mono bg-white p-3 border border-[#E8DFD5] rounded-none">
                {camp.message_template}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Dispatched WhatsApp Notification Logs */}
      <div className="bg-white p-6 border border-[#DFD3C4] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B89668]" />
            <h4 className="font-serif text-lg font-medium text-[#1C1A18]">
              Live WhatsApp Dispatch Log
            </h4>
          </div>
          <span className="text-[11px] text-[#736B62]">
            Total {notifications.length} alerts triggered
          </span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#736B62]">
              No notifications triggered yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-[#FAF8F5] border border-[#E8DFD5] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1C1A18] capitalize">
                    To: {n.recipient_type} ({n.recipient_phone})
                  </span>
                  <span className="text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 font-semibold">
                    {n.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#4A453F] whitespace-pre-wrap font-mono">
                  {n.message}
                </p>
                <div className="text-[10px] text-[#736B62]">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
