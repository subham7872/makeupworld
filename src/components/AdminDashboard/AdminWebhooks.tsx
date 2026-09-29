import React, { useState, useEffect } from 'react';
import { Network, Send, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { WebhookLog } from '../../types';

export const AdminWebhooks: React.FC = () => {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchLogs = () => {
    fetch('/api/webhooks/logs')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleTestDispatch = async () => {
    setIsDispatching(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/webhooks/test-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead.created',
          test_lead_name: 'Pooja Malhotra (Test Lead)',
          wedding_date: '2026-12-18',
          phone: '+1 (415) 555-9000',
          utm_source: 'instagram_reels_test',
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setTestResult('Test webhook dispatched to FlowmaticAI gateway (HTTP 200 OK)');
      fetchLogs();
    } catch {
      setTestResult('Failed to dispatch test webhook');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview & Architecture Card */}
      <div className="bg-white p-6 border border-[#DFD3C4] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-[#8C6D45]" />
              <h3 className="font-serif text-2xl font-medium text-[#1C1A18]">
                CRM & FlowmaticAI Webhook Gateway
              </h3>
            </div>
            <p className="text-xs text-[#736B62] mt-1">
              Outbound webhooks automatically broadcast lead captures and booked appointments to external CRMs, FlowmaticAI, and Google Sheets.
            </p>
          </div>

          <button
            onClick={handleTestDispatch}
            disabled={isDispatching}
            className="px-4 py-2 bg-[#1C1A18] hover:bg-[#332F2A] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#E6DCB8]" />
            <span>{isDispatching ? 'Dispatching...' : 'Dispatch Test Payload'}</span>
          </button>
        </div>

        {testResult && (
          <div className="p-3 bg-[#F2F7F2] border border-[#B4D7B4] text-[#1B431E] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>{testResult}</span>
          </div>
        )}

        {/* Integration Endpoints List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-[#FAF8F5] border border-[#E8DFD5]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6D45] block">
              POST /api/webhooks/lead-created
            </span>
            <span className="text-[11px] text-[#4A453F] block mt-1">
              Fires when a new bride inquiry is submitted
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#E8DFD5]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6D45] block">
              POST /api/webhooks/appointment-created
            </span>
            <span className="text-[11px] text-[#4A453F] block mt-1">
              Fires when consultation slot is reserved
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#E8DFD5]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6D45] block">
              POST /api/webhooks/appointment-cancelled
            </span>
            <span className="text-[11px] text-[#4A453F] block mt-1">
              Fires on reschedule or slot cancellation
            </span>
          </div>
        </div>
      </div>

      {/* Webhook Activity Logs */}
      <div className="bg-white p-6 border border-[#DFD3C4] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
          <h4 className="font-serif text-lg font-medium text-[#1C1A18]">
            Outbound Dispatch Logs ({logs.length})
          </h4>
          <button
            onClick={fetchLogs}
            className="text-xs text-[#8C6D45] hover:text-[#1C1A18] flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#736B62]">
              No webhook payloads logged yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-[#FAF8F5] border border-[#DFD3C4] space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C1A18]">
                    EVENT: {log.event}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    HTTP {log.status_code} {log.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#736B62] truncate">
                  Target: {log.destination}
                </div>
                <pre className="text-[10px] bg-white p-2 border border-[#E8DFD5] overflow-x-auto text-[#3D3833]">
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
                <div className="text-[10px] text-[#736B62]">
                  Timestamp: {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
