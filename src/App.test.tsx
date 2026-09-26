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

  it('lazy-loads every image in the rendered invitation', () => {
    const imageTags = [...renderInvitation().matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);

    expect(imageTags.length).toBeGreaterThan(0);
    expect(imageTags.every((tag) => /\sloading="lazy"/.test(tag))).toBe(true);
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
