import { describe, expect, it } from 'vitest';
import { introTimeline, shouldPlayIntro, waitForIntroArtwork } from './intro';

describe('invitation opening animation', () => {
  it('opens the curtains after the bouquet appears and reveals the main page directly', () => {
    expect(introTimeline.bouquetAtMs).toBeLessThan(introTimeline.curtainOpenAtMs);
    expect(introTimeline.curtainOpenAtMs + introTimeline.fadeDurationMs).toBe(introTimeline.totalDurationMs);
  });

  it('plays for visitors using standard motion and skips for reduced motion', () => {
    expect(shouldPlayIntro(false)).toBe(true);
    expect(shouldPlayIntro(true)).toBe(false);
  });

  it('waits for every opening image and reports a decode failure without opening', async () => {
    let finishBouquetDecode: () => void = () => {};
    let artworkDecoded: boolean | undefined;
    const bouquetDecode = new Promise<void>((resolve) => {
      finishBouquetDecode = resolve;
    });
    const artworkReady = waitForIntroArtwork([
      { decode: () => Promise.resolve() },
      { decode: () => bouquetDecode },
      { decode: () => Promise.reject(new Error('Curtain asset unavailable')) },
    ]);
    void artworkReady.then((decoded) => {
      artworkDecoded = decoded;
    });

    await Promise.resolve();
    expect(artworkDecoded).toBeUndefined();

    finishBouquetDecode();
    expect(await artworkReady).toBe(false);
    expect(artworkDecoded).toBe(false);
  });
});
