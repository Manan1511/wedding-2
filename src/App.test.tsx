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

  it('offers entry music without fetching the track before a guest plays it', () => {
    const markup = renderInvitation();

    expect(markup).toMatch(/<audio\b(?=[^>]*src="\/audio\/entry-music\.mp3")(?=[^>]*preload="none")[^>]*>/);
    expect(markup).toContain('class="music-toggle"');
    expect(markup).toContain('aria-label="Play entry music"');
    expect(markup).toContain('aria-pressed="false"');
  });

  it('uses a text label and decorative arrow for the scroll cue', () => {
    const markup = renderInvitation();
    const heroLink = markup.match(/<a class="hero-link"[^>]*>(.*?)<\/a>/)?.[1] ?? '';

    expect(heroLink).toContain('THE DAY OUR FOREVER BEGINS');
    expect(heroLink).toContain('<svg class="hero-link-arrow"');
    expect(heroLink).toContain('aria-hidden="true"');
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
