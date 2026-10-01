import { describe, expect, it } from 'vitest';
// @ts-expect-error This test reads its optimized static audio asset; Node types are intentionally omitted from the browser app.
import { readFileSync } from 'node:fs';
import invitationHtml from '../../index.html?raw';
import { buildRsvpMessage, buildWhatsAppUrl, isValidRsvpResponse } from './rsvp';
import { wedding } from './wedding';

describe('wedding intro artwork', () => {
  it('uses Travis Weds Sayali as the invitation metadata', () => {
    expect(invitationHtml).toContain('<title>Travis Weds Sayali</title>');
    expect(invitationHtml).toContain('name="description" content="Travis Weds Sayali, a Christian wedding invitation celebrating love, faith, and family."');
    expect(invitationHtml).toContain('property="og:title" content="Travis Weds Sayali"');
    expect(invitationHtml).toContain('property="og:description" content="Travis Weds Sayali, a Christian wedding invitation celebrating love, faith, and family."');
  });

  it('uses compressed WebP files for every image served by the invitation', () => {
    expect(Object.values(wedding.artwork).every((imagePath) => imagePath.endsWith('.webp'))).toBe(true);
  });

  it('uses the Wedding March while keeping entry music under 350 KB', () => {
    const audio = readFileSync(new URL('../../public/audio/entry-music.mp3', import.meta.url));

    expect(audio.toString('latin1')).toContain('Wedding March');
    expect(audio.byteLength).toBeLessThan(350_000);
  });

  it('keeps the scratch-card foil texture lightweight for a scroll-loaded section', () => {
    const texture = readFileSync(new URL('../../public/images/scratch-champagne.webp', import.meta.url));

    expect(texture.byteLength).toBeLessThan(180_000);
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
