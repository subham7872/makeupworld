import { AttributionData } from '../types';

export function getAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get('utm_source') || undefined;
  const utm_medium = params.get('utm_medium') || undefined;
  const utm_campaign = params.get('utm_campaign') || undefined;
  const utm_content = params.get('utm_content') || undefined;
  const fbclid = params.get('fbclid') || undefined;

  // Infer platform
  let source_platform = 'Direct';
  if (utm_source) {
    if (/instagram/i.test(utm_source)) source_platform = 'Instagram';
    else if (/facebook|fb/i.test(utm_source)) source_platform = 'Facebook';
    else if (/google/i.test(utm_source)) source_platform = 'Google';
    else source_platform = utm_source;
  } else if (fbclid) {
    source_platform = 'Meta Ads';
  } else if (document.referrer) {
    if (/instagram\.com/i.test(document.referrer)) source_platform = 'Instagram';
    else if (/facebook\.com/i.test(document.referrer)) source_platform = 'Facebook';
    else if (/google\./i.test(document.referrer)) source_platform = 'Google';
  }

  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    fbclid,
    source_platform,
    referrer: document.referrer || undefined,
    landing_page: window.location.pathname
  };
}

export function buildWhatsAppLink(phone: string, defaultMessage: string, attribution?: AttributionData): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  let message = defaultMessage;
  
  if (attribution?.utm_source) {
    // preserve attribution invisibly or subtly
    message += ` (Ref: ${attribution.utm_source}${attribution.utm_campaign ? ` / ${attribution.utm_campaign}` : ''})`;
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
