import { describe, expect, it } from 'vitest';
import { champagneConfettiPieces, launchConfettiBurst } from './confetti';

describe('scratch reveal confetti', () => {
  it('launches the celebration only for the first date reveal', () => {
    expect(launchConfettiBurst(false)).toBe(true);
    expect(launchConfettiBurst(true)).toBe(false);
  });

  it('uses a lightweight champagne and gold palette', () => {
    expect(champagneConfettiPieces).toHaveLength(18);
    expect(new Set(champagneConfettiPieces.map((piece) => piece.color))).toEqual(
      new Set(['#f8ebc7', '#d5b06a', '#fff7df', '#b98a3d']),
    );
  });
});
