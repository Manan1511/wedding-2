import { describe, expect, it } from 'vitest';
import { setEntryMusicPlayback } from './music';

describe('entry music playback', () => {
  it('starts playback when the browser allows it', async () => {
    let playCount = 0;
    const audio = {
      play: async () => { playCount += 1; },
      pause: () => {},
    };

    await expect(setEntryMusicPlayback(audio, true)).resolves.toBe(true);
    expect(playCount).toBe(1);
  });

  it('reports blocked autoplay so the guest can start music manually', async () => {
    const audio = {
      play: () => Promise.reject(new Error('Playback needs a user gesture')),
      pause: () => {},
    };

    await expect(setEntryMusicPlayback(audio, true)).resolves.toBe(false);
  });

  it('pauses without issuing a new play request', async () => {
    let playCount = 0;
    let pauseCount = 0;
    const audio = {
      play: async () => { playCount += 1; },
      pause: () => { pauseCount += 1; },
    };

    await expect(setEntryMusicPlayback(audio, false)).resolves.toBe(false);
    expect(playCount).toBe(0);
    expect(pauseCount).toBe(1);
  });
});
