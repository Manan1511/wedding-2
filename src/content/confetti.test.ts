import { describe, expect, it } from 'vitest';
import { sageBlueConfettiPieces, launchConfettiBurst } from './confetti';

describe('scratch reveal confetti', () => {
  it('launches the celebration only for the first date reveal', () => {
    expect(launchConfettiBurst(false)).toBe(true);
    expect(launchConfettiBurst(true)).toBe(false);
  });

  it('uses visible paper shapes in a sage green and blue palette', () => {
    expect(sageBlueConfettiPieces).toHaveLength(30);
    expect(new Set(sageBlueConfettiPieces.map((piece) => piece.color))).toEqual(
      new Set(['#e3eae1', '#5d765e', '#f8faf6', '#243f5b']),
    );
    expect(new Set(sageBlueConfettiPieces.map((piece) => piece.shape))).toEqual(
      new Set(['is-ribbon', 'is-diamond', 'is-cross']),
    );
  });
});
