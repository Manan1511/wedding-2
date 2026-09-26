export const introTimeline = {
  bouquetAtMs: 120,
  curtainOpenAtMs: 1_400,
  fadeDurationMs: 1_050,
  totalDurationMs: 2_450,
} as const;

export function shouldPlayIntro(prefersReducedMotion: boolean): boolean {
  return !prefersReducedMotion;
}

export async function waitForIntroArtwork(
  images: readonly Pick<HTMLImageElement, 'decode'>[],
): Promise<boolean> {
  const results = await Promise.allSettled(
    images.map((image) => Promise.resolve().then(() => image.decode())),
  );

  return results.every((result) => result.status === 'fulfilled');
}
