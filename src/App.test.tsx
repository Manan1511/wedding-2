import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
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

  it('uses a text label and decorative arrow for the scroll cue', () => {
    const markup = renderInvitation();
    const heroLink = markup.match(/<a class="hero-link"[^>]*>(.*?)<\/a>/)?.[1] ?? '';

    expect(heroLink).toContain('THE DAY OUR FOREVER BEGINS');
    expect(heroLink).toContain('<svg class="hero-link-arrow"');
    expect(heroLink).toContain('aria-hidden="true"');
  });

  it('uses no em dash in the invitation copy', () => {
    expect(renderInvitation()).not.toContain(String.fromCharCode(0x2014));
  });
});
