export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'CONSULTATION'
  | 'QUOTE_SENT'
  | 'FOLLOW_UP'
  | 'BOOKED'
  | 'LOST';

export type AppointmentStatus =
  | 'CONFIRMED'
  | 'PENDING'
  | 'RESCHEDULED'
  | 'CANCELLED';

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  fbclid?: string;
  source_platform?: string; // Instagram, Facebook, Direct, Referral
  referrer?: string;
  landing_page?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  wedding_date: string;
  wedding_location: string;
  service_category: string;
  budget_range: string;
  functions_count: string;
  preferred_package?: string;
  heard_from?: string;
  notes?: string;
  reference_image_url?: string;
  
  // Attribution
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  fbclid: string;
  lead_source: string; // e.g. "Instagram", "Facebook", "Meta Ad", "Direct"
  
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  followup_sent_count?: number;
}

export interface Appointment {
  id: string;
  lead_id: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  wedding_date: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  service_id: string;
  service_name: string;
  appointment_type: string; // e.g. "Bridal Consultation", "Bridal Trial"
  duration_minutes: number;
  status: AppointmentStatus;
  notes?: string;
  location: string; // e.g. "Bridal Atelier Studio (or Online Google Meet)"
  created_at: string;
  updated_at: string;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "19:00"
  hasBreak: boolean;
  breakStart?: string; // "13:00"
  breakEnd?: string; // "14:00"
}

export interface BusinessAvailability {
  businessHours: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  bufferMinutes: number;
  slotDurationMinutes: number;
  blockedDates: string[]; // ['2026-10-15', '2026-11-01']
  fullyBookedDates: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  duration_minutes: number;
  starting_price: number;
  currency: string;
  features: string[];
  image_url: string;
  is_popular?: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  tier: string;
  tagline: string;
  price: number;
  currency: string;
  ideal_for: string;
  deliverables: string[];
  is_signature?: boolean;
  badge?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Bridal' | 'Reception' | 'Engagement' | 'Haldi' | 'Mehendi' | 'Hair Styling' | 'Before / After';
  bride_name: string;
  venue_city: string;
  image_url: string;
  description: string;
  tags: string[];
  look_type: 'HD Makeup' | 'Airbrush' | 'Soft Glam' | 'Dewy Royal';
}

export interface ReelVideo {
  id: string;
  title: string;
  bride_name: string;
  occasion: string;
  video_url: string;
  poster_url: string;
  duration: string;
  likes: string;
  caption: string;
}

export interface TestimonialItem {
  id: string;
  bride_name: string;
  wedding_date: string;
  venue: string;
  rating: number;
  quote: string;
  service_rendered: string;
  image_url: string;
  verified_bride: boolean;
}

export interface FollowUpCampaign {
  id: string;
  delay_label: string;
  delay_days: number;
  channel: 'whatsapp' | 'email';
  subject_or_hook: string;
  message_template: string;
  enabled: boolean;
}

export interface WebhookLog {
  id: string;
  event: 'lead.created' | 'appointment.created' | 'appointment.cancelled';
  payload: Record<string, any>;
  destination: string;
  status: 'DELIVERED' | 'FAILED';
  status_code: number;
  created_at: string;
}

export interface WhatsAppNotification {
  id: string;
  recipient_type: 'customer' | 'artist';
  recipient_phone: string;
  message: string;
  status: 'SENT' | 'SIMULATED';
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name:
    | 'page_view'
    | 'portfolio_view'
    | 'service_view'
    | 'availability_started'
    | 'date_selected'
    | 'appointment_started'
    | 'lead_submitted'
    | 'appointment_booked'
    | 'whatsapp_clicked'
    | 'phone_clicked';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ArtistProfile {
  artist_name: string;
  brand_name: string;
  tagline: string;
  experience_years: number;
  brides_served_count: number;
  studio_address: string;
  primary_city: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  instagram_handle: string;
  service_radius_info: string;
}
