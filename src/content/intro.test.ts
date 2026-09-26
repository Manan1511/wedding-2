import { describe, expect, it } from 'vitest';
import { introTimeline, shouldPlayIntro } from './intro';

describe('invitation opening animation', () => {
  it('opens the curtains after the bouquet appears and reveals the main page directly', () => {
    expect(introTimeline.bouquetAtMs).toBeLessThan(introTimeline.curtainOpenAtMs);
    expect(introTimeline.curtainOpenAtMs + introTimeline.fadeDurationMs).toBe(introTimeline.totalDurationMs);
  });

  it('plays for visitors using standard motion and skips for reduced motion', () => {
    expect(shouldPlayIntro(false)).toBe(true);
    expect(shouldPlayIntro(true)).toBe(false);
  });
});
