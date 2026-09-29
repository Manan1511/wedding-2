import { describe, expect, it } from 'vitest';
import { buildChurchMapTileUrls } from './churchMap';

describe('buildChurchMapTileUrls', () => {
  it('returns a centred 3 by 3 OpenStreetMap tile grid around St. Xavier’s Church', () => {
    expect(buildChurchMapTileUrls({ x: 46216, y: 29337, zoom: 16 })).toEqual([
      'https://tile.openstreetmap.org/16/46215/29336.png',
      'https://tile.openstreetmap.org/16/46216/29336.png',
      'https://tile.openstreetmap.org/16/46217/29336.png',
      'https://tile.openstreetmap.org/16/46215/29337.png',
      'https://tile.openstreetmap.org/16/46216/29337.png',
      'https://tile.openstreetmap.org/16/46217/29337.png',
      'https://tile.openstreetmap.org/16/46215/29338.png',
      'https://tile.openstreetmap.org/16/46216/29338.png',
      'https://tile.openstreetmap.org/16/46217/29338.png',
    ]);
  });
});
