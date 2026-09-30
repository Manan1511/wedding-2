import { describe, expect, it } from 'vitest';
import { champagneConfettiPieces, launchConfettiBurst } from './confetti';

describe('scratch reveal confetti', () => {
  it('launches the celebration only for the first date reveal', () => {
    expect(launchConfettiBurst(false)).toBe(true);
    expect(launchConfettiBurst(true)).toBe(false);
  });

  it('uses visible paper shapes in a champagne and gold palette', () => {
    expect(champagneConfettiPieces).toHaveLength(30);
    expect(new Set(champagneConfettiPieces.map((piece) => piece.color))).toEqual(
      new Set(['#f8ebc7', '#d5b06a', '#fff7df', '#b98a3d']),
    );
    expect(new Set(champagneConfettiPieces.map((piece) => piece.shape))).toEqual(
      new Set(['is-ribbon', 'is-diamond', 'is-cross']),
    );
  });
});
