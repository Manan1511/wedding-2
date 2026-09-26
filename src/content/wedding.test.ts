import { describe, expect, it } from 'vitest';
import { buildRsvpMessage, buildWhatsAppUrl, isValidRsvpResponse } from './rsvp';
import { getCountdown } from './time';
import { wedding } from './wedding';

describe('wedding intro artwork', () => {
  it('points to the original watercolor curtain asset', () => {
    expect(wedding.artwork.curtain).toBe('/images/wedding-curtain-watercolor.png');
    expect(wedding.artwork.curtainWide).toBe('/images/wedding-curtain-watercolor-wide.png');
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
