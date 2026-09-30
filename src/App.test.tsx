import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
// @ts-expect-error This test reads its stylesheet from disk; Node types are intentionally omitted from the browser app.
import { readFileSync } from 'node:fs';
import App from './App';

function renderInvitation() {
  return renderToStaticMarkup(<App />);
}

describe('wedding invitation content', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: false }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the couple and both family blessings in the invitation story', () => {
    const markup = renderInvitation();

    for (const name of [
      'Travis Hale',
      'Sayali Dharpal',
      'Late Mr Tyrone Duddley Hale',
      'Late Mrs Janet Tyrone Hale',
      'Mr. Narendra Devidasrao Dharpal',
      'Mrs. Meena Narendra Dharpal',
    ]) {
      expect(markup).toContain(name);
    }
  });

  it('keeps every image lazy while prioritizing only the opening and hero artwork', () => {
    const imageTags = [...renderInvitation().matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
    const prioritizedImages = imageTags.filter((tag) => /\sfetchPriority="high"/.test(tag));
    const closingImage = imageTags.find((tag) => tag.includes('wedding-blessing-sketch.webp'));

    expect(imageTags).toHaveLength(5);
    expect(imageTags.every((tag) => /\sloading="lazy"/.test(tag))).toBe(true);
    expect(prioritizedImages).toHaveLength(4);
    expect(closingImage).not.toMatch(/\sfetchPriority="high"/);
  });

  it('keeps the opening animation closed until its artwork has decoded', () => {
    expect(renderInvitation()).toMatch(/<div class="invitation-intro[^\"]*"[^>]*data-artwork-ready="false"/);
  });

  it('starts entry music after the curtain sequence without exposing a guest control', () => {
    const markup = renderInvitation();

    expect(markup).toMatch(/<audio\b(?=[^>]*src="\/audio\/entry-music\.mp3")(?=[^>]*preload="metadata")[^>]*>/);
    expect(markup).not.toContain('class="music-toggle"');
    expect(markup).not.toContain('Play music');
    expect(markup).not.toContain('Pause music');
  });

  it('replaces the ticking countdown with a touch-friendly scratch reveal', () => {
    const markup = renderInvitation();
    const invitationStyles = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
    const scratchCardStyle = invitationStyles.match(/\.scratch-card\s*\{([^}]*)\}/)?.[1] ?? '';
    const scratchContentStyle = invitationStyles.match(/\.scratch-reveal-content\s*\{([^}]*)\}/)?.[1] ?? '';
    const revealButton = markup.match(/<button class="scratch-reveal-button"[^>]*>/)?.[0] ?? '';

    expect(markup).toContain('class="scratch-section"');
    expect(markup).toContain('Scratch to reveal the wedding date and time');
    expect(markup).toContain('Reveal date and time');
    expect(markup).not.toContain('Until we say,');
    expect(markup).not.toContain('class="countdown-grid"');
    expect(scratchCardStyle).toMatch(/user-select:\s*none/);
    expect(scratchContentStyle).toMatch(/visibility:\s*hidden/);
    expect(revealButton).toContain('aria-expanded="false"');
    expect(revealButton).not.toContain('aria-pressed=');
  });

  it('anchors the celebration burst to the full scratch section instead of the card', () => {
    const markup = renderInvitation();

    expect(markup).toMatch(/<section class="scratch-section"[^>]*><div class="scratch-confetti"/);
  });

  it('presents the ceremony schedule beside a lazy map visual with directions', () => {
    const markup = renderInvitation();

    expect(markup).toContain('id="ceremony"');
    expect(markup).toContain('Our Day');
    expect(markup).toContain('church-map');
    expect(markup).toContain('Map location for St. Xavier’s Church, Pune');
    expect(markup).toContain('© OpenStreetMap contributors');
    expect(markup).not.toContain('<iframe');
    expect(markup).toContain('href="https://maps.app.goo.gl/C6eYegm5jJE84UL57"');
  });

  it('uses a text label and decorative arrow for the scroll cue', () => {
    const markup = renderInvitation();
    const heroLink = markup.match(/<a class="hero-link hero-scroll-cue"[^>]*>(.*?)<\/a>/)?.[1] ?? '';

    expect(heroLink).toContain('THE DAY OUR FOREVER BEGINS');
    expect(heroLink).toContain('<svg class="hero-link-arrow"');
    expect(heroLink).toContain('aria-hidden="true"');
  });

  it('keeps the scroll cue low on the artwork using lettering-only contrast', () => {
    const invitationStyles = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
    const cueStyle = invitationStyles.match(/\.hero-scroll-cue\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(cueStyle).toMatch(/position:\s*absolute/);
    expect(cueStyle).toMatch(/top:\s*72%/);
    expect(cueStyle).toMatch(/-webkit-text-stroke\s*:/);
    expect(cueStyle).not.toMatch(/\b(background|border|box-shadow|backdrop-filter)\s*:/);
  });

  it('keeps the hero names unboxed and vertically centered in the space between the family line and Scripture', () => {
    const invitationStyles = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
    const heroNameStyles = [...invitationStyles.matchAll(/\.hero-names\s*\{([^}]*)\}/g)].map(([, styles]) => styles);
    const titleSpaceStyle = invitationStyles.match(/\.hero-title-space\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(titleSpaceStyle).toMatch(/display:\s*grid/);
    expect(titleSpaceStyle).toMatch(/place-items:\s*center/);
    expect(heroNameStyles.every((styles) => !/position:\s*absolute/.test(styles))).toBe(true);
    expect(heroNameStyles.every((styles) => !/\b(border|background|box-shadow|backdrop-filter)\s*:/.test(styles))).toBe(true);
  });

  it('uses text-only contrast and moves mobile hero copy onto the brightest part of the artwork', () => {
    const invitationStyles = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
    const nameStyle = invitationStyles.match(/\.hero-names\s*\{([^}]*)\}/)?.[1] ?? '';
    const scriptureStyle = invitationStyles.match(/\.hero-scripture\s*\{([^}]*)\}/)?.[1] ?? '';
    const linkStyle = invitationStyles.match(/\.hero-link\s*\{([^}]*)\}/)?.[1] ?? '';
    const mobileCopyStyle = invitationStyles.match(/@media \(max-width: 760px\)\s*\{[\s\S]*?\.hero-copy\s*\{([^}]*)\}/)?.[1] ?? '';
    const mobileTitleSpaceStyle = invitationStyles.match(/@media \(max-width: 760px\)\s*\{[\s\S]*?\.hero-title-space\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(nameStyle).toMatch(/text-shadow\s*:/);
    expect(scriptureStyle).toMatch(/text-shadow\s*:/);
    expect(linkStyle).toMatch(/text-shadow\s*:/);
    expect(mobileCopyStyle).toMatch(/margin-top:\s*clamp\(104px, 13vh, 136px\)/);
    expect(mobileTitleSpaceStyle).toMatch(/height:\s*clamp\(124px, 32vw, 156px\)/);
  });

  it('aligns the script word date with the rest of the postcard copy', () => {
    const invitationStyles = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
    const scriptWordStyle = invitationStyles.match(/\.postcard-copy h2 em\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(scriptWordStyle).not.toMatch(/padding-left\s*:/);
  });

  it('sets the couple monogram as the browser tab icon', () => {
    const document = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

    expect(document).toMatch(/<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"\s*\/>/);

    const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');
    expect(favicon).toContain('viewBox="0 0 64 64"');
    expect(favicon).toContain('>T');
    expect(favicon).toContain('>S');
  });

  it('uses no em dash in the invitation copy', () => {
    expect(renderInvitation()).not.toContain(String.fromCharCode(0x2014));
  });
});
