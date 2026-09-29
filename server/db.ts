import fs from 'fs';
import path from 'path';
import {
  Lead,
  Appointment,
  BusinessAvailability,
  ServiceItem,
  PackageItem,
  PortfolioItem,
  ReelVideo,
  TestimonialItem,
  FollowUpCampaign,
  WebhookLog,
  WhatsAppNotification,
  AnalyticsEvent,
  ArtistProfile
} from '../src/types';

export interface DatabaseSchema {
  profile: ArtistProfile;
  availability: BusinessAvailability;
  services: ServiceItem[];
  packages: PackageItem[];
  portfolio: PortfolioItem[];
  reels: ReelVideo[];
  testimonials: TestimonialItem[];
  leads: Lead[];
  appointments: Appointment[];
  followups: FollowUpCampaign[];
  webhooks: WebhookLog[];
  notifications: WhatsAppNotification[];
  analytics: AnalyticsEvent[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const initialProfile: ArtistProfile = {
  artist_name: 'Sanjana Roy',
  brand_name: 'Aura Bridal Atelier',
  tagline: 'Your Wedding Day. Your Signature Look.',
  experience_years: 9,
  brides_served_count: 420,
  studio_address: '142 Grand Heritage Arcade, West Wing, Atelier Suite 4B',
  primary_city: 'Metro & Destination On-Location Worldwide',
  phone_number: '+1 (800) 287-2687',
  whatsapp_number: '+18002872687',
  email: 'sanjana@aurabridal.com',
  instagram_handle: '@aurabridal.atelier',
  service_radius_info: 'Studio consultations & worldwide on-location bridal team travel',
};

const initialAvailability: BusinessAvailability = {
  businessHours: {
    monday: { isOpen: true, openTime: '10:00', closeTime: '18:30', hasBreak: true, breakStart: '13:30', breakEnd: '14:30' },
    tuesday: { isOpen: true, openTime: '10:00', closeTime: '18:30', hasBreak: true, breakStart: '13:30', breakEnd: '14:30' },
    wednesday: { isOpen: true, openTime: '10:00', closeTime: '18:30', hasBreak: true, breakStart: '13:30', breakEnd: '14:30' },
    thursday: { isOpen: true, openTime: '10:00', closeTime: '18:30', hasBreak: true, breakStart: '13:30', breakEnd: '14:30' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '19:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
    saturday: { isOpen: true, openTime: '09:00', closeTime: '19:30', hasBreak: true, breakStart: '13:30', breakEnd: '14:30' },
    sunday: { isOpen: true, openTime: '10:00', closeTime: '17:00', hasBreak: false },
  },
  bufferMinutes: 30,
  slotDurationMinutes: 45,
  blockedDates: ['2026-10-24', '2026-11-14'],
  fullyBookedDates: ['2026-10-31', '2026-12-12'],
};

const initialServices: ServiceItem[] = [
  {
    id: 'srv-bridal-hd',
    title: 'Signature Bridal HD & Airbrush Artistry',
    category: 'Bridal',
    tagline: '16-Hour Sweatproof, Radiant Wedding Day Canvas',
    description: 'Bespoke bridal complexion blending luxury skin prep, flawless waterproof airbrush base, custom lash design, and jewel-tone eye artistry.',
    duration_minutes: 180,
    starting_price: 650,
    currency: 'USD',
    features: [
      'Comprehensive skin-texture diagnostic',
      'Temptu pro silicone airbrush foundation',
      'Dimensional contouring & tear-resistant seal',
      'Handcrafted Siberian silk lash customization',
      'Complimentary emergency bridal touch-up kit'
    ],
    image_url: '/images/bridal/service_bridal_hd.jpg',
    is_popular: true,
  },
  {
    id: 'srv-bridal-hair',
    title: 'Bespoke Architectural Bridal Hair Styling',
    category: 'Hair Styling',
    tagline: 'Crown Jewels, Texturized Buns & Romantic Cascades',
    description: 'Sculpted to harmonize with your neckline, dupatta drape, veil weight, and facial structure for effortless motion and locked-in longevity.',
    duration_minutes: 120,
    starting_price: 350,
    currency: 'USD',
    features: [
      'Anatomical face-shape analysis',
      'Structural padding & weightless volume boost',
      'Dupatta, veil & headpiece pinning',
      'Heat & humidity defense finishing glaze',
      'Fresh floral or jewel adornment placement'
    ],
    image_url: '/images/bridal/service_bridal_hair.jpg',
  },
  {
    id: 'srv-reception-glam',
    title: 'Haute Couture Reception & Sangeet Glam',
    category: 'Reception',
    tagline: 'Electric Evening Smokey Eye & Glass Complexion',
    description: 'Dazzling, high-impact evening transformation crafted for dim mood lighting, flash photography, and all-night dancing.',
    duration_minutes: 120,
    starting_price: 450,
    currency: 'USD',
    features: [
      'Multi-chrome shimmer or editorial matte eye',
      'Strobed champagne highlighter formulation',
      'Smudge-proof transfer-resistant lip layering',
      'Lash amplification with individual flare clusters'
    ],
    image_url: '/images/bridal/service_reception.jpg',
  },
  {
    id: 'srv-engagement-haldi',
    title: 'Dewy Engagement, Haldi & Mehendi Looks',
    category: 'Engagement',
    tagline: 'Effortless Floral Radiance & Sunlight Glow',
    description: 'Fresh, breathable, skin-first artistry designed for outdoor ceremonies and daytime golden-hour celebrations.',
    duration_minutes: 90,
    starting_price: 320,
    currency: 'USD',
    features: [
      'Hydrating botanical facial primer infusion',
      'Sun-kissed dewy blush drape',
      'Feathered brows & soft defined lash line',
      'Fresh floral hair integration'
    ],
    image_url: '/images/bridal/service_engagement.jpg',
  },
];

const initialPackages: PackageItem[] = [
  {
    id: 'pkg-essential',
    name: 'The Essential Bride',
    tier: 'Single Event',
    tagline: 'Flawless execution for the ceremony of a lifetime',
    price: 850,
    currency: 'USD',
    ideal_for: 'Brides needing one complete signature bridal event transformation.',
    deliverables: [
      'Full Bridal HD Airbrush Makeup with 16h lock',
      'Custom Bridal Hair Design & veil pinning',
      'Complete Sari / Lehenga draping & accessory placement',
      'Premium 3D mink/silk faux lashes',
      'Luxury bridal emergency kit (blotters, lip pot, pins)'
    ],
  },
  {
    id: 'pkg-signature',
    name: 'The Signature Royal Bride',
    tier: 'Most Requested',
    tagline: 'Comprehensive styling across 2 marquee celebrations',
    price: 1550,
    currency: 'USD',
    is_signature: true,
    badge: 'Preferred by 78% of Brides',
    ideal_for: 'Brides having Wedding Ceremony + Evening Reception.',
    deliverables: [
      'Includes all Essential Bride inclusions for 2 events',
      'In-studio 90-minute trial consultation included',
      'Look changeover & touchup transition service',
      'Deluxe skincare prep ritual with 24K gold serum',
      'Hair padding, hair extensions styling & fresh florals',
      'Mother-of-the-Bride complimentary touch-up'
    ],
  },
  {
    id: 'pkg-luxury',
    name: 'Haute Atelier Destination Suite',
    tier: 'Complete Wedding Suite',
    tagline: 'Full weekend VIP bridal coverage & entourage styling',
    price: 2850,
    currency: 'USD',
    ideal_for: 'Full multi-day wedding festivities (Haldi, Mehendi, Wedding, Reception).',
    deliverables: [
      'Complete coverage for up to 4 bridal functions',
      'Artist stays on-site for immediate photo retouches',
      'Unlimited bridal consultation & moodboard styling sessions',
      'Customized bridal skin timeline (30 days out)',
      'Bridal trial with full portrait session look test',
      '2 Bridesmaids / Sister glam sessions included'
    ],
  },
];

const initialPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Regal Heritage Crimson Bride',
    category: 'Bridal',
    bride_name: 'Ananya S.',
    venue_city: 'The Fairmont Grand Ballroom, SF',
    image_url: '/images/bridal/look1_regal_crimson.jpg',
    description: 'Timeless vermilion drape paired with soft bronze cut-crease eyes, velvet crimson lip stain, and 24K gold dusted cheeks.',
    tags: ['HD Airbrush', 'Traditional Veil', 'Matte Lip'],
    look_type: 'HD Makeup',
  },
  {
    id: 'port-2',
    title: 'Champagne Shimmer Reception',
    category: 'Reception',
    bride_name: 'Priyanka M.',
    venue_city: 'Ritz-Carlton Half Moon Bay',
    image_url: '/images/bridal/look2_reception_glam.jpg',
    description: 'High-glam champagne foil lids, sculpted cheekbones, nude gloss, and voluminous Hollywood waves with diamond pins.',
    tags: ['Soft Glam', 'Hollywood Waves', 'Glass Skin'],
    look_type: 'Soft Glam',
  },
  {
    id: 'port-3',
    title: 'Sunset Haldi Dewy Glow',
    category: 'Haldi',
    bride_name: 'Meera K.',
    venue_city: 'Napa Valley Vineyard Estate',
    image_url: '/images/bridal/look3_haldi_dewy.jpg',
    description: 'Skin-first luminous glow, peach-coral blush flush, brushed-up soap brows, and messy fishtail braid with baby breath blooms.',
    tags: ['Dewy Base', 'Botanical Florals', 'Fresh Coral'],
    look_type: 'Dewy Royal',
  },
  {
    id: 'port-4',
    title: 'Modern Minimalist Pastel Bride',
    category: 'Bridal',
    bride_name: 'Aisha R.',
    venue_city: 'Villa Montalvo Arts Center',
    image_url: '/images/bridal/look4_pastel_modern.jpg',
    description: 'Rose-gold duochrome eyes, clean winged eyeliner, hydrated petal lips, and architectural low chignon bun.',
    tags: ['Rose Gold', 'Architectural Bun', 'Airbrush'],
    look_type: 'Airbrush',
  },
  {
    id: 'port-5',
    title: 'Emerald Velvet Sangeet Glamour',
    category: 'Mehendi',
    bride_name: 'Tanvi D.',
    venue_city: 'Palace Hotel Gold Ballroom',
    image_url: '/images/bridal/look5_mehendi_sangeet.jpg',
    description: 'Smoked olive liner with gilded gold accents, glass skin finish, and voluminous half-up romantic textured curls.',
    tags: ['Textured Waves', 'Glitter Accent', 'Waterproof'],
    look_type: 'Soft Glam',
  },
  {
    id: 'port-6',
    title: 'Before & After: Natural Texture Elevation',
    category: 'Before / After',
    bride_name: 'Kavita P.',
    venue_city: 'Private Estate, Los Altos',
    image_url: '/images/bridal/look6_before_after.jpg',
    description: 'Color correction without masking real skin texture, covering hyperpigmentation while preserving a luminous, breathable skin-like radiance.',
    tags: ['Real Skin Finish', 'Color Correction', 'Non-Cakey'],
    look_type: 'HD Makeup',
  },
  {
    id: 'port-7',
    title: 'Architectural Pearl & Jasmine Updo',
    category: 'Hair Styling',
    bride_name: 'Ritu V.',
    venue_city: 'St. Regis San Francisco',
    image_url: '/images/bridal/look7_hair_architectural.jpg',
    description: 'Sculpted romantic bridal chignon with hand-woven jasmine sprigs and pearl pins, anchored for all-day veil support.',
    tags: ['Bridal Updo', 'Veil Pinning', 'Volume Padding'],
    look_type: 'HD Makeup',
  },
];

const initialReels: ReelVideo[] = [
  {
    id: 'reel-1',
    title: 'The Emotional First Mirror Reveal',
    bride_name: 'Shreya Kapoor',
    occasion: 'Wedding Day Reveal',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-putting-on-her-makeup-on-her-wedding-day-40438-large.mp4',
    poster_url: '/images/bridal/reel_poster1.jpg',
    duration: '0:28',
    likes: '14.2K',
    caption: 'When she opened her eyes and saw her final signature bridal look for the first time. Not a dry eye in the bridal suite! ❤️',
  },
  {
    id: 'reel-2',
    title: '16-Hour Sweatproof Reception Test',
    bride_name: 'Divya & Rohan',
    occasion: 'Post-Bhangra Check',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-putting-on-makeup-in-front-of-a-mirror-40439-large.mp4',
    poster_url: '/images/bridal/reel_poster2.jpg',
    duration: '0:22',
    likes: '28.6K',
    caption: 'After 4 hours of non-stop dance floor madness: zero creasing, zero shine breakthrough, lashes still locked in perfection.',
  },
  {
    id: 'reel-3',
    title: 'Architectural Bun & Dupatta Rigging',
    bride_name: 'Rhea Patel',
    occasion: 'Masterclass Hair',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-mascara-41804-large.mp4',
    poster_url: '/images/bridal/reel_poster3.jpg',
    duration: '0:34',
    likes: '19.8K',
    caption: 'How we anchor a 4.5kg heavy zardozi dupatta so it feels weightless and stays locked for 12 hours without causing headaches.',
  },
];

const initialTestimonials: TestimonialItem[] = [
  {
    id: 't-1',
    bride_name: 'Dr. Natasha Mehta',
    wedding_date: 'October 12, 2025',
    venue: 'Rosewood Sand Hill, Menlo Park',
    rating: 5,
    quote: 'Sanjana did not just do my makeup; she gave me serene calm on the most hectic morning of my life. My skin looked like porcelain glass yet felt completely weightless. At 2 AM after dancing, it looked identical to 10 AM. Every guest asked who my artist was.',
    service_rendered: 'Signature Royal Bride Suite',
    image_url: '/images/bridal/bride_natasha.jpg',
    verified_bride: true,
  },
  {
    id: 't-2',
    bride_name: 'Simran Bajaj-Cole',
    wedding_date: 'December 04, 2025',
    venue: 'Meadowood Napa Valley',
    rating: 5,
    quote: 'As someone who rarely wears makeup, my biggest fear was looking like a stranger in my wedding photos. Sanjana listened to every worry, enhanced my natural features, and created a look that made my husband tear up during the first look. Best decision of our wedding planning.',
    service_rendered: 'The Essential Bride Package',
    image_url: '/images/bridal/bride_simran.jpg',
    verified_bride: true,
  },
  {
    id: 't-3',
    bride_name: 'Zahra Al-Hashimi',
    wedding_date: 'February 18, 2026',
    venue: 'San Francisco City Hall & Rotunda',
    rating: 5,
    quote: 'Booking the date through her availability tool on Instagram was so fast and frictionless. We locked the date in 2 minutes, had our consultation call that week, and the trial was sublime. Professional, hygienic, and extraordinarily talented.',
    service_rendered: 'Haute Atelier Destination Suite',
    image_url: '/images/bridal/bride_zahra.jpg',
    verified_bride: true,
  },
];

const initialLeads: Lead[] = [
  {
    id: 'lead-101',
    name: 'Aishwarya Sen',
    phone: '+1 (415) 555-0192',
    whatsapp: '+14155550192',
    email: 'aishwarya.sen@gmail.com',
    wedding_date: '2026-11-20',
    wedding_location: 'San Jose Silicon Valley Convention Center',
    service_category: 'Bridal HD & Hair Styling',
    budget_range: '$1,500 - $2,500',
    functions_count: '2 Functions (Sangeet + Wedding)',
    preferred_package: 'The Signature Royal Bride',
    heard_from: 'Instagram Reel (Mirror Reveal)',
    utm_source: 'instagram',
    utm_medium: 'paid_social',
    utm_campaign: 'bridal_festive_2026',
    utm_content: 'reel_reveal_01',
    fbclid: 'IwAR3vK9xZb4_demo99182',
    lead_source: 'Instagram Ad',
    status: 'CONSULTATION',
    notes: 'Bride prefers warm champagne shimmer and lightweight base. Sister may also book hair.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    followup_sent_count: 1,
  },
  {
    id: 'lead-102',
    name: 'Maya Chen-Rao',
    phone: '+1 (510) 555-4421',
    whatsapp: '+15105554421',
    email: 'maya.rao@outlook.com',
    wedding_date: '2026-12-05',
    wedding_location: 'Carmel Valley Ranch',
    service_category: 'Bridal Makeup',
    budget_range: '$1,000 - $1,800',
    functions_count: '1 Function (Main Ceremony)',
    preferred_package: 'The Essential Bride',
    heard_from: 'Instagram Ad',
    utm_source: 'instagram',
    utm_medium: 'stories',
    utm_campaign: 'fall_weddings_california',
    utm_content: 'story_poll_availability',
    fbclid: 'IwAR1aL8_storydemo',
    lead_source: 'Instagram Stories',
    status: 'QUALIFIED',
    notes: 'Requested consultation for bridal trial availability in October.',
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    followup_sent_count: 1,
  },
  {
    id: 'lead-103',
    name: 'Sunita Sharma',
    phone: '+1 (650) 555-8911',
    whatsapp: '+16505558911',
    email: 'sunita.sharma@techcorp.io',
    wedding_date: '2026-10-18',
    wedding_location: 'San Francisco Palace of Fine Arts',
    service_category: 'Bridal HD & Reception Glam',
    budget_range: '$2,500+',
    functions_count: '3 Functions (Haldi, Wedding, Reception)',
    preferred_package: 'Haute Atelier Destination Suite',
    heard_from: 'Facebook Ad',
    utm_source: 'facebook',
    utm_medium: 'cpc',
    utm_campaign: 'luxury_destination_brides',
    utm_content: 'carousel_portfolio',
    fbclid: 'fbclid_sample_98471',
    lead_source: 'Facebook Ad',
    status: 'BOOKED',
    notes: 'Deposit received! Wedding date locked in atelier schedule.',
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    followup_sent_count: 2,
  },
  {
    id: 'lead-104',
    name: 'Pooja Varma',
    phone: '+1 (408) 555-2311',
    whatsapp: '+14085552311',
    email: 'pooja.varma@gmail.com',
    wedding_date: '2026-11-28',
    wedding_location: 'Palo Alto Stanford Faculty Club',
    service_category: 'Bridal Consultation',
    budget_range: '$800 - $1,200',
    functions_count: '1 Function',
    preferred_package: 'The Essential Bride',
    heard_from: 'WhatsApp Referral',
    utm_source: 'direct_whatsapp',
    utm_medium: 'referral',
    utm_campaign: 'word_of_mouth',
    utm_content: 'friend_recommendation',
    fbclid: '',
    lead_source: 'Referral',
    status: 'NEW',
    notes: 'Referred by past bride Dr. Natasha Mehta.',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    followup_sent_count: 0,
  }
];

const initialAppointments: Appointment[] = [
  {
    id: 'apt-201',
    lead_id: 'lead-101',
    customer_name: 'Aishwarya Sen',
    customer_phone: '+1 (415) 555-0192',
    customer_whatsapp: '+14155550192',
    wedding_date: '2026-11-20',
    appointment_date: '2026-10-02',
    start_time: '11:00 AM',
    end_time: '11:45 AM',
    service_id: 'srv-bridal-hd',
    service_name: 'Bridal Look Consultation & Face Architecture',
    appointment_type: 'Bridal Consultation',
    duration_minutes: 45,
    status: 'CONFIRMED',
    location: 'Atelier Studio Suite 4B (Or Video Call)',
    notes: 'Consultation to discuss lehenga tones and jewelry placement.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'apt-202',
    lead_id: 'lead-103',
    customer_name: 'Sunita Sharma',
    customer_phone: '+1 (650) 555-8911',
    customer_whatsapp: '+16505558911',
    wedding_date: '2026-10-18',
    appointment_date: '2026-10-03',
    start_time: '02:30 PM',
    end_time: '04:00 PM',
    service_id: 'srv-bridal-hd',
    service_name: 'Hands-On Bridal Makeup Trial & Veil Test',
    appointment_type: 'Bridal Trial',
    duration_minutes: 90,
    status: 'CONFIRMED',
    location: 'Atelier Studio Suite 4B',
    notes: 'Trial look testing airbrush shade match with sample neck piece.',
    created_at: new Date(Date.now() - 3600000 * 90).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

const initialFollowups: FollowUpCampaign[] = [
  {
    id: 'fu-1',
    delay_label: 'Immediate Submission',
    delay_days: 0,
    channel: 'whatsapp',
    subject_or_hook: 'Instant Consultation Confirmation',
    message_template: 'Hi {{name}} ❤️ Thank you for contacting Aura Bridal Atelier! Your bridal consultation request for {{appointment_date}} at {{appointment_time}} has been reserved. Sanjana will review your wedding date ({{wedding_date}}) and reach out with prep tips!',
    enabled: true,
  },
  {
    id: 'fu-2',
    delay_label: 'After 24 Hours',
    delay_days: 1,
    channel: 'whatsapp',
    subject_or_hook: 'Bridal Package Selection Guide',
    message_template: 'Hi {{name}} ✨ Would you like help choosing between our Essential and Signature Royal packages? Here is a 2-minute bridal guide curated by Sanjana for {{wedding_location}} weddings: https://aurabridal.com/packages',
    enabled: true,
  },
  {
    id: 'fu-3',
    delay_label: 'After 3 Days',
    delay_days: 3,
    channel: 'whatsapp',
    subject_or_hook: 'Wedding Date Urgency Check',
    message_template: 'Dear {{name}}, your wedding date {{wedding_date}} is during peak bridal season and we have 2 other inquiries for that weekend. Would you like to lock your slot this week?',
    enabled: true,
  },
  {
    id: 'fu-4',
    delay_label: 'After 7 Days',
    delay_days: 7,
    channel: 'email',
    subject_or_hook: 'Final Assistance on Your Bridal Journey',
    message_template: 'Dear {{name}}, we are finalizing our fall calendar. If you still require bespoke bridal makeup for {{wedding_date}}, reply to this email or tap our WhatsApp VIP line.',
    enabled: false,
  }
];

const initialWebhooks: WebhookLog[] = [
  {
    id: 'wh-1',
    event: 'appointment.created',
    payload: { lead_id: 'lead-101', customer_name: 'Aishwarya Sen', appointment_date: '2026-10-02', start_time: '11:00 AM' },
    destination: 'https://api.flowmatic.ai/webhooks/v1/inbound-booking',
    status: 'DELIVERED',
    status_code: 200,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  }
];

const initialNotifications: WhatsAppNotification[] = [
  {
    id: 'wn-1',
    recipient_type: 'customer',
    recipient_phone: '+14155550192',
    message: 'Hi Aishwarya ❤️ Thank you for contacting Aura Bridal Atelier. Your consultation request for Oct 2 at 11:00 AM has been received.',
    status: 'SENT',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'wn-2',
    recipient_type: 'artist',
    recipient_phone: '+18002872687',
    message: '🔔 NEW BRIDAL LEAD: Aishwarya Sen | Wedding: 2026-11-20 | Budget: $1,500 - $2,500 | Source: Instagram Ad',
    status: 'SENT',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  }
];

const initialAnalytics: AnalyticsEvent[] = [
  { id: 'ev-1', event_name: 'page_view', timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), metadata: { utm_source: 'instagram', landing_page: '/' } },
  { id: 'ev-2', event_name: 'availability_started', timestamp: new Date(Date.now() - 3600000 * 19).toISOString(), metadata: { utm_source: 'instagram' } },
  { id: 'ev-3', event_name: 'date_selected', timestamp: new Date(Date.now() - 3600000 * 18.5).toISOString(), metadata: { date: '2026-11-20' } },
  { id: 'ev-4', event_name: 'lead_submitted', timestamp: new Date(Date.now() - 3600000 * 18.2).toISOString(), metadata: { lead_id: 'lead-101' } },
  { id: 'ev-5', event_name: 'appointment_booked', timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), metadata: { appointment_id: 'apt-201' } },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing db.json, initializing fresh store', e);
    }

    const initial: DatabaseSchema = {
      profile: initialProfile,
      availability: initialAvailability,
      services: initialServices,
      packages: initialPackages,
      portfolio: initialPortfolio,
      reels: initialReels,
      testimonials: initialTestimonials,
      leads: initialLeads,
      appointments: initialAppointments,
      followups: initialFollowups,
      webhooks: initialWebhooks,
      notifications: initialNotifications,
      analytics: initialAnalytics,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public getProfile(): ArtistProfile {
    return this.data.profile;
  }

  public updateProfile(updates: Partial<ArtistProfile>): ArtistProfile {
    this.data.profile = { ...this.data.profile, ...updates };
    this.saveData();
    return this.data.profile;
  }

  public getAvailability(): BusinessAvailability {
    return this.data.availability;
  }

  public updateAvailability(updates: Partial<BusinessAvailability>): BusinessAvailability {
    this.data.availability = { ...this.data.availability, ...updates };
    this.saveData();
    return this.data.availability;
  }

  public getLeads(): Lead[] {
    return this.data.leads;
  }

  public addLead(lead: Lead): Lead {
    this.data.leads.unshift(lead);
    this.saveData();
    return lead;
  }

  public updateLeadStatus(id: string, status: Lead['status'], notes?: string): Lead | null {
    const lead = this.data.leads.find(l => l.id === id);
    if (!lead) return null;
    lead.status = status;
    lead.updated_at = new Date().toISOString();
    if (notes) lead.notes = (lead.notes ? lead.notes + '\n' : '') + notes;
    this.saveData();
    return lead;
  }

  public getAppointments(): Appointment[] {
    return this.data.appointments;
  }

  public addAppointment(apt: Appointment): Appointment {
    this.data.appointments.unshift(apt);
    this.saveData();
    return apt;
  }

  public updateAppointmentStatus(id: string, status: Appointment['status'], notes?: string): Appointment | null {
    const apt = this.data.appointments.find(a => a.id === id);
    if (!apt) return null;
    apt.status = status;
    apt.updated_at = new Date().toISOString();
    if (notes) apt.notes = notes;
    this.saveData();
    return apt;
  }

  public logWebhook(webhook: WebhookLog) {
    this.data.webhooks.unshift(webhook);
    if (this.data.webhooks.length > 50) this.data.webhooks.pop();
    this.saveData();
  }

  public logNotification(notification: WhatsAppNotification) {
    this.data.notifications.unshift(notification);
    if (this.data.notifications.length > 50) this.data.notifications.pop();
    this.saveData();
  }

  public logAnalytics(event: AnalyticsEvent) {
    this.data.analytics.unshift(event);
    if (this.data.analytics.length > 100) this.data.analytics.pop();
    this.saveData();
  }

  public updateFollowups(followups: FollowUpCampaign[]): FollowUpCampaign[] {
    this.data.followups = followups;
    this.saveData();
    return this.data.followups;
  }
}

export const db = new Database();
