export const introTimeline = {
  bouquetAtMs: 120,
  curtainOpenAtMs: 1_400,
  fadeDurationMs: 1_050,
  totalDurationMs: 2_450,
} as const;

export function shouldPlayIntro(prefersReducedMotion: boolean): boolean {
  return !prefersReducedMotion;
}
