import { describe, expect, it } from 'vitest';
import invitationHtml from '../../index.html?raw';
import { buildRsvpMessage, buildWhatsAppUrl, isValidRsvpResponse } from './rsvp';
import { getCountdown } from './time';
import { wedding } from './wedding';

describe('wedding intro artwork', () => {
  it('uses compressed WebP files for every image served by the invitation', () => {
    expect(Object.values(wedding.artwork).every((imagePath) => imagePath.endsWith('.webp'))).toBe(true);
  });

  it('preloads the responsive opening and hero assets, but not the closing image', () => {
    const html = invitationHtml;
    const preloadTags = [...html.matchAll(/<link\b[^>]*rel="preload"[^>]*>/g)].map(([tag]) => tag);
    const initialArtwork = [
      wedding.artwork.curtain,
      wedding.artwork.curtainWide,
      wedding.artwork.bouquet,
      wedding.artwork.hero,
      wedding.artwork.heroWide,
    ];

    expect(preloadTags).toHaveLength(initialArtwork.length);
    for (const imagePath of initialArtwork) {
      expect(preloadTags.some((tag) => tag.includes(`href="${imagePath}"`))).toBe(true);
    }
    expect(preloadTags.some((tag) => tag.includes(`href="${wedding.artwork.closing}"`))).toBe(false);
  });
});

describe('getCountdown', () => {
  it('breaks the remaining event time into days, hours, minutes, and seconds', () => {
    const countdown = getCountdown(
      '2026-12-26T16:00:00+05:30',
      new Date('2026-12-25T15:00:00.000Z'),
    );

    expect(countdown).toEqual({ days: 0, hours: 19, minutes: 30, seconds: 0, complete: false });
  });

  it('stops at zero once the ceremony has begun', () => {
    const countdown = getCountdown(
      '2026-12-26T16:00:00+05:30',
      new Date('2026-12-26T10:30:01.000Z'),
    );

    expect(countdown).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, complete: true });
  });
});

describe('wedding RSVP helpers', () => {
  it('creates a concise WhatsApp message with a manually entered guest count', () => {
    const message = buildRsvpMessage(
      { guestName: '  Asha Patel ', guestCount: 2, message: ' Vegetarian meal, please. ' },
      'Grace & Daniel',
    );

    expect(message).toBe(
      "Wedding RSVP for Grace & Daniel\n\nName: Asha Patel\nGuests: 2\nMessage: Vegetarian meal, please.",
    );
  });

  it('validates a non-empty name and positive whole guest count', () => {
    expect(isValidRsvpResponse({ guestName: 'Asha Patel', guestCount: 3 })).toBe(true);
    expect(isValidRsvpResponse({ guestName: '  ', guestCount: 3 })).toBe(false);
    expect(isValidRsvpResponse({ guestName: 'Asha Patel', guestCount: 0 })).toBe(false);
    expect(isValidRsvpResponse({ guestName: 'Asha Patel', guestCount: 1.5 })).toBe(false);
  });

  it('normalizes the host number and URL-encodes the RSVP message', () => {
    const url = buildWhatsAppUrl(
      '+91 98765-43210',
      'Wedding RSVP for Grace & Daniel\nName: Asha Patel',
    );

    expect(url).toBe(
      'https://wa.me/919876543210?text=Wedding%20RSVP%20for%20Grace%20%26%20Daniel%0AName%3A%20Asha%20Patel',
    );
  });

  it('keeps WhatsApp disabled while the host number is still a placeholder', () => {
    expect(buildWhatsAppUrl('REPLACE_WITH_HOST_NUMBER', 'Wedding RSVP')).toBeNull();
  });
});
