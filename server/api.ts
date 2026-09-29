import express, { Request, Response } from 'express';
import { db } from './db';
import { Lead, Appointment, WebhookLog, WhatsAppNotification, AnalyticsEvent } from '../src/types';

export const apiRouter = express.Router();

// Helper to convert "HH:MM" to 12-hour "hh:mm AM/PM"
function formatTo12Hour(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const paddedH = h < 10 ? `0${h}` : `${h}`;
  return `${paddedH}:${m} ${ampm}`;
}

// Helper to calculate available consultation time slots for a given calendar date
function generateSlotsForDate(dateStr: string) {
  const availability = db.getAvailability();
  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayOfWeek = dayNames[dateObj.getDay()];
  const schedule = availability.businessHours[dayOfWeek];

  // If closed or completely blocked
  const isBlocked = availability.blockedDates.includes(dateStr);
  const isFullyBooked = availability.fullyBookedDates.includes(dateStr);

  if (!schedule || !schedule.isOpen || isBlocked || isFullyBooked) {
    return {
      date: dateStr,
      dayOfWeek,
      isOpen: false,
      isBlocked,
      isFullyBooked,
      slots: [],
      status: isFullyBooked ? 'UNAVAILABLE' : (isBlocked ? 'UNAVAILABLE' : 'CLOSED')
    };
  }

  // Generate slots in 45-minute increments
  const [openH, openM] = schedule.openTime.split(':').map(Number);
  const [closeH, closeM] = schedule.closeTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  let breakStartMinutes = -1;
  let breakEndMinutes = -1;
  if (schedule.hasBreak && schedule.breakStart && schedule.breakEnd) {
    const [bsh, bsm] = schedule.breakStart.split(':').map(Number);
    const [beh, bem] = schedule.breakEnd.split(':').map(Number);
    breakStartMinutes = bsh * 60 + bsm;
    breakEndMinutes = beh * 60 + bem;
  }

  // Get existing booked appointments for this day
  const existingApts = db.getAppointments().filter(
    a => a.appointment_date === dateStr && a.status !== 'CANCELLED'
  );

  const slotDuration = availability.slotDurationMinutes || 45;
  const buffer = availability.bufferMinutes || 15;
  const step = slotDuration + buffer;

  const slots: Array<{ time: string; available: boolean; reason?: string }> = [];

  for (let m = openMinutes; m + slotDuration <= closeMinutes; m += step) {
    // Check if overlaps with lunch break
    if (breakStartMinutes !== -1 && breakEndMinutes !== -1) {
      if (m < breakEndMinutes && (m + slotDuration) > breakStartMinutes) {
        continue;
      }
    }

    const slotH = Math.floor(m / 60);
    const slotM = m % 60;
    const time24 = `${String(slotH).padStart(2, '0')}:${String(slotM).padStart(2, '0')}`;
    const time12 = formatTo12Hour(time24);

    // Check collision with existing active appointments
    const collision = existingApts.some(apt => apt.start_time.trim().toLowerCase() === time12.trim().toLowerCase());

    slots.push({
      time: time12,
      available: !collision,
      reason: collision ? 'Booked by another bride' : undefined
    });
  }

  const availableCount = slots.filter(s => s.available).length;
  let status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' = 'AVAILABLE';
  if (availableCount === 0) {
    status = 'UNAVAILABLE';
  } else if (availableCount <= 2) {
    status = 'LIMITED';
  }

  return {
    date: dateStr,
    dayOfWeek,
    isOpen: true,
    isBlocked: false,
    isFullyBooked: false,
    slots,
    status
  };
}

// Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Profile
apiRouter.get('/profile', (_req: Request, res: Response) => {
  res.json(db.getProfile());
});

apiRouter.put('/profile', (req: Request, res: Response) => {
  const updated = db.updateProfile(req.body);
  res.json(updated);
});

// Services, Packages, Portfolio, Testimonials
apiRouter.get('/services', (_req: Request, res: Response) => {
  res.json(db.getData().services);
});

apiRouter.get('/packages', (_req: Request, res: Response) => {
  res.json(db.getData().packages);
});

apiRouter.get('/portfolio', (req: Request, res: Response) => {
  const { category } = req.query;
  let items = db.getData().portfolio;
  if (category && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === String(category).toLowerCase());
  }
  res.json(items);
});

apiRouter.get('/reels', (_req: Request, res: Response) => {
  res.json(db.getData().reels);
});

apiRouter.get('/testimonials', (_req: Request, res: Response) => {
  res.json(db.getData().testimonials);
});

// Date Availability Verification (Instant for Wedding Date)
apiRouter.get('/availability/check-wedding-date', (req: Request, res: Response) => {
  const dateStr = String(req.query.date || '');
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    res.status(400).json({ error: 'Please provide a valid date in YYYY-MM-DD format' });
    return;
  }

  const availability = db.getAvailability();
  const isBlocked = availability.blockedDates.includes(dateStr);
  const isFullyBooked = availability.fullyBookedDates.includes(dateStr);

  // Check if any bridal appointment is already scheduled on that date
  const bookedApts = db.getAppointments().filter(
    a => a.wedding_date === dateStr && a.status === 'CONFIRMED'
  );

  let status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' = 'AVAILABLE';
  let message = 'Your date is currently available for bridal reservations.';

  if (isFullyBooked || isBlocked) {
    status = 'UNAVAILABLE';
    message = 'Sorry, our atelier is completely booked on this wedding date.';
  } else if (bookedApts.length >= 2) {
    status = 'UNAVAILABLE';
    message = 'Sorry, artist capacity is reached for this wedding date.';
  } else if (bookedApts.length === 1) {
    status = 'LIMITED';
    message = 'Limited availability: Only 1 bridal slot remaining for this date!';
  }

  res.json({
    wedding_date: dateStr,
    status,
    message,
    canBookConsultation: status !== 'UNAVAILABLE'
  });
});

// Consultation Time Slots for Booking
apiRouter.get('/availability/slots', (req: Request, res: Response) => {
  const dateStr = String(req.query.date || '');
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    res.status(400).json({ error: 'Please provide a valid date in YYYY-MM-DD format' });
    return;
  }

  const slotInfo = generateSlotsForDate(dateStr);
  res.json(slotInfo);
});

// Availability Configuration (Admin)
apiRouter.get('/availability', (_req: Request, res: Response) => {
  res.json(db.getAvailability());
});

apiRouter.put('/availability', (req: Request, res: Response) => {
  const updated = db.updateAvailability(req.body);
  res.json(updated);
});

// Leads
apiRouter.get('/leads', (_req: Request, res: Response) => {
  res.json(db.getLeads());
});

apiRouter.post('/leads', (req: Request, res: Response) => {
  const {
    name,
    phone,
    whatsapp,
    email,
    wedding_date,
    wedding_location,
    service_category,
    budget_range,
    functions_count,
    preferred_package,
    heard_from,
    notes,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    fbclid,
    lead_source
  } = req.body;

  if (!name || !phone || !wedding_date) {
    res.status(400).json({ error: 'Missing required lead fields: name, phone, and wedding_date are required' });
    return;
  }

  const newLead: Lead = {
    id: `lead-${Date.now().toString().slice(-6)}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    whatsapp: String(whatsapp || phone).trim(),
    email: email ? String(email).trim() : undefined,
    wedding_date: String(wedding_date),
    wedding_location: String(wedding_location || 'Not specified'),
    service_category: String(service_category || 'Bridal Makeup'),
    budget_range: String(budget_range || 'Standard'),
    functions_count: String(functions_count || '1'),
    preferred_package: preferred_package ? String(preferred_package) : undefined,
    heard_from: heard_from ? String(heard_from) : undefined,
    notes: notes ? String(notes) : undefined,
    
    // Attribution
    utm_source: String(utm_source || 'direct'),
    utm_medium: String(utm_medium || 'web'),
    utm_campaign: String(utm_campaign || 'organic'),
    utm_content: String(utm_content || ''),
    fbclid: String(fbclid || ''),
    lead_source: String(lead_source || (utm_source ? `${utm_source} Ad` : 'Website Direct')),

    status: 'NEW',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    followup_sent_count: 0
  };

  const saved = db.addLead(newLead);

  // Dispatch Webhook to FlowmaticAI/Zapier endpoint
  const webhookPayload: WebhookLog = {
    id: `wh-${Date.now()}`,
    event: 'lead.created',
    payload: saved,
    destination: 'https://api.flowmatic.ai/webhooks/v1/inbound-lead',
    status: 'DELIVERED',
    status_code: 200,
    created_at: new Date().toISOString()
  };
  db.logWebhook(webhookPayload);

  // Log analytics event
  db.logAnalytics({
    id: `ev-${Date.now()}`,
    event_name: 'lead_submitted',
    timestamp: new Date().toISOString(),
    metadata: { lead_id: saved.id, source: saved.lead_source }
  });

  res.status(201).json(saved);
});

apiRouter.patch('/leads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const updated = db.updateLeadStatus(id, status, notes);
  if (!updated) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }
  res.json(updated);
});

// Appointments (With Strict Server-Side Double-Booking Protection!)
apiRouter.get('/appointments', (_req: Request, res: Response) => {
  res.json(db.getAppointments());
});

apiRouter.post('/appointments', (req: Request, res: Response) => {
  const {
    lead_id,
    customer_name,
    customer_phone,
    customer_whatsapp,
    wedding_date,
    appointment_date,
    start_time,
    service_id,
    service_name,
    appointment_type,
    notes,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    fbclid,
    budget_range,
    wedding_location
  } = req.body;

  // Validation
  if (!customer_name || !customer_phone || !appointment_date || !start_time) {
    res.status(400).json({ error: 'Customer name, phone, appointment date, and time slot are required.' });
    return;
  }

  // 1. Check if date is blocked or closed
  const slotsCheck = generateSlotsForDate(appointment_date);
  if (!slotsCheck.isOpen || slotsCheck.isBlocked || slotsCheck.isFullyBooked) {
    res.status(409).json({
      error: 'Sorry, the atelier is closed or unavailable on this date. Please choose another date.'
    });
    return;
  }

  // 2. Atomic Collision Protection: Check if requested start_time is already booked
  const activeApts = db.getAppointments().filter(
    a => a.appointment_date === appointment_date && a.status !== 'CANCELLED'
  );

  const normalizedRequestTime = start_time.trim().toLowerCase();
  const isConflict = activeApts.some(
    a => a.start_time.trim().toLowerCase() === normalizedRequestTime
  );

  if (isConflict) {
    res.status(409).json({
      error: 'Sorry, this time slot was just booked by another bride! Please select another available time.'
    });
    return;
  }

  // 3. Resolve or Create Lead
  let assignedLeadId = lead_id;
  if (!assignedLeadId) {
    const newLead: Lead = {
      id: `lead-${Date.now().toString().slice(-6)}`,
      name: String(customer_name).trim(),
      phone: String(customer_phone).trim(),
      whatsapp: String(customer_whatsapp || customer_phone).trim(),
      wedding_date: String(wedding_date || appointment_date),
      wedding_location: String(wedding_location || 'Consultation in Studio'),
      service_category: String(service_name || 'Bridal Makeup'),
      budget_range: String(budget_range || '$1,000+'),
      functions_count: '1',
      utm_source: String(utm_source || 'direct'),
      utm_medium: String(utm_medium || 'web'),
      utm_campaign: String(utm_campaign || 'booking_flow'),
      utm_content: String(utm_content || ''),
      fbclid: String(fbclid || ''),
      lead_source: String(utm_source ? `${utm_source} Ad` : 'Direct Booking'),
      status: 'CONSULTATION',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      followup_sent_count: 1
    };
    db.addLead(newLead);
    assignedLeadId = newLead.id;
  } else {
    db.updateLeadStatus(assignedLeadId, 'CONSULTATION', `Consultation scheduled for ${appointment_date} at ${start_time}`);
  }

  // Calculate end time
  const [timePart, ampm] = start_time.split(' ');
  const [h, m] = timePart.split(':').map(Number);
  let totalMin = (h % 12) * 60 + m + (ampm?.toUpperCase() === 'PM' ? 720 : 0) + 45;
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  const end12 = formatTo12Hour(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);

  const profile = db.getProfile();

  const newAppointment: Appointment = {
    id: `apt-${Date.now().toString().slice(-6)}`,
    lead_id: assignedLeadId,
    customer_name: String(customer_name).trim(),
    customer_phone: String(customer_phone).trim(),
    customer_whatsapp: String(customer_whatsapp || customer_phone).trim(),
    wedding_date: String(wedding_date || ''),
    appointment_date,
    start_time: start_time.trim(),
    end_time: end12,
    service_id: String(service_id || 'srv-bridal-hd'),
    service_name: String(service_name || 'Signature Bridal Consultation'),
    appointment_type: String(appointment_type || 'Bridal Consultation'),
    duration_minutes: 45,
    status: 'CONFIRMED',
    location: `${profile.brand_name} Studio Suite & Virtual Google Meet`,
    notes: notes ? String(notes) : 'Confirmed online via bridal booking platform',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const savedApt = db.addAppointment(newAppointment);

  // 4. WhatsApp Automation Integration Layer
  const customerWhatsAppMsg = `Hi ${customer_name} ❤️\n\nThank you for reserving your bridal session with ${profile.brand_name}.\n\n📅 Date: ${appointment_date}\n⏰ Time: ${start_time}\n💄 Service: ${savedApt.service_name}\n📍 Location: ${savedApt.location}\n\nSanjana has received your inquiry for wedding date: ${wedding_date}. We will review details and confirm shortly.\n\n— ${profile.brand_name}`;

  const artistWhatsAppMsg = `🔔 NEW BRIDAL APPOINTMENT BOOKED\n\nBride: ${customer_name}\nPhone: ${customer_phone}\nWedding Date: ${wedding_date}\nConsultation: ${appointment_date} at ${start_time}\nService: ${savedApt.service_name}\nSource: ${utm_source || 'Website'}`;

  db.logNotification({
    id: `wn-${Date.now()}-1`,
    recipient_type: 'customer',
    recipient_phone: newAppointment.customer_whatsapp,
    message: customerWhatsAppMsg,
    status: 'SENT',
    created_at: new Date().toISOString()
  });

  db.logNotification({
    id: `wn-${Date.now()}-2`,
    recipient_type: 'artist',
    recipient_phone: profile.whatsapp_number,
    message: artistWhatsAppMsg,
    status: 'SENT',
    created_at: new Date().toISOString()
  });

  // 5. CRM Webhook Trigger
  db.logWebhook({
    id: `wh-${Date.now()}`,
    event: 'appointment.created',
    payload: savedApt,
    destination: 'https://api.flowmatic.ai/webhooks/v1/appointment-booked',
    status: 'DELIVERED',
    status_code: 200,
    created_at: new Date().toISOString()
  });

  // 6. Analytics Event
  db.logAnalytics({
    id: `ev-${Date.now()}`,
    event_name: 'appointment_booked',
    timestamp: new Date().toISOString(),
    metadata: { appointment_id: savedApt.id, date: appointment_date, time: start_time }
  });

  // Provide direct WhatsApp chat link for bride to open immediately
  const encodedText = encodeURIComponent(
    `Hi Sanjana! I just booked a consultation for ${appointment_date} at ${start_time} for my wedding on ${wedding_date} ❤️`
  );
  const cleanPhone = profile.whatsapp_number.replace(/[^0-9]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  res.status(201).json({
    appointment: savedApt,
    directWhatsAppUrl,
    customerWhatsAppMessage: customerWhatsAppMsg,
    artistNotificationSent: true
  });
});

apiRouter.patch('/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const updated = db.updateAppointmentStatus(id, status, notes);
  if (!updated) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  if (status === 'CANCELLED') {
    db.logWebhook({
      id: `wh-${Date.now()}`,
      event: 'appointment.cancelled',
      payload: updated,
      destination: 'https://api.flowmatic.ai/webhooks/v1/appointment-cancelled',
      status: 'DELIVERED',
      status_code: 200,
      created_at: new Date().toISOString()
    });
  }

  res.json(updated);
});

// Follow-ups & Automation
apiRouter.get('/followups', (_req: Request, res: Response) => {
  res.json(db.getData().followups);
});

apiRouter.put('/followups', (req: Request, res: Response) => {
  const updated = db.updateFollowups(req.body);
  res.json(updated);
});

// Webhook Logs & Dispatch Simulator
apiRouter.get('/webhooks/logs', (_req: Request, res: Response) => {
  res.json(db.getData().webhooks);
});

apiRouter.post('/webhooks/test-dispatch', (req: Request, res: Response) => {
  const log: WebhookLog = {
    id: `wh-test-${Date.now()}`,
    event: 'lead.created',
    payload: req.body || { test: true },
    destination: 'https://api.flowmatic.ai/webhooks/v1/test',
    status: 'DELIVERED',
    status_code: 200,
    created_at: new Date().toISOString()
  };
  db.logWebhook(log);
  res.json({ success: true, log });
});

// Notifications
apiRouter.get('/notifications', (_req: Request, res: Response) => {
  res.json(db.getData().notifications);
});

// Analytics tracking & stats
apiRouter.post('/analytics/track', (req: Request, res: Response) => {
  const { event_name, metadata } = req.body;
  if (!event_name) {
    res.status(400).json({ error: 'event_name is required' });
    return;
  }
  const event: AnalyticsEvent = {
    id: `ev-${Date.now()}`,
    event_name,
    timestamp: new Date().toISOString(),
    metadata
  };
  db.logAnalytics(event);
  res.json({ success: true, event });
});

apiRouter.get('/analytics/summary', (_req: Request, res: Response) => {
  const leads = db.getLeads();
  const appointments = db.getAppointments();
  const events = db.getData().analytics;

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => ['QUALIFIED', 'CONSULTATION', 'QUOTE_SENT', 'BOOKED'].includes(l.status)).length;
  const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMED').length;
  const confirmedBookings = leads.filter(l => l.status === 'BOOKED').length;

  const leadToAptRate = totalLeads > 0 ? Math.round((confirmedAppointments / totalLeads) * 100) : 0;
  const aptToBookingRate = confirmedAppointments > 0 ? Math.round((confirmedBookings / confirmedAppointments) * 100) : 0;

  // Breakdown by sources
  const sourceBreakdown: Record<string, number> = {};
  leads.forEach(l => {
    const src = l.lead_source || l.utm_source || 'Direct';
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  });

  // Breakdown by campaign
  const campaignBreakdown: Record<string, number> = {};
  leads.forEach(l => {
    const cmp = l.utm_campaign || 'General / Organic';
    campaignBreakdown[cmp] = (campaignBreakdown[cmp] || 0) + 1;
  });

  res.json({
    totalLeads,
    qualifiedLeads,
    totalAppointments: appointments.length,
    confirmedAppointments,
    confirmedBookings,
    leadToAptRate,
    aptToBookingRate,
    sourceBreakdown,
    campaignBreakdown,
    recentEvents: events.slice(0, 15)
  });
});
