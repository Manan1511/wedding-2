export interface ChampagneConfettiPiece {
  color: '#f8ebc7' | '#d5b06a' | '#fff7df' | '#b98a3d';
  delay: number;
  drift: number;
  left: number;
  rise: number;
  rotation: number;
  shape: 'is-dot' | 'is-ribbon';
}

export const champagneConfettiPieces: ChampagneConfettiPiece[] = [
  { color: '#f8ebc7', delay: 0, drift: -170, left: 46, rise: -180, rotation: -220, shape: 'is-ribbon' },
  { color: '#d5b06a', delay: 35, drift: -120, left: 48, rise: -142, rotation: 180, shape: 'is-dot' },
  { color: '#fff7df', delay: 60, drift: -70, left: 49, rise: -204, rotation: -150, shape: 'is-ribbon' },
  { color: '#b98a3d', delay: 15, drift: -40, left: 51, rise: -156, rotation: 130, shape: 'is-dot' },
  { color: '#f8ebc7', delay: 85, drift: 10, left: 50, rise: -220, rotation: -180, shape: 'is-ribbon' },
  { color: '#d5b06a', delay: 50, drift: 42, left: 52, rise: -148, rotation: 210, shape: 'is-dot' },
  { color: '#fff7df', delay: 115, drift: 78, left: 49, rise: -188, rotation: 170, shape: 'is-ribbon' },
  { color: '#b98a3d', delay: 25, drift: 112, left: 51, rise: -172, rotation: -140, shape: 'is-dot' },
  { color: '#f8ebc7', delay: 90, drift: 162, left: 53, rise: -198, rotation: 230, shape: 'is-ribbon' },
  { color: '#d5b06a', delay: 130, drift: -195, left: 47, rise: -116, rotation: -190, shape: 'is-dot' },
  { color: '#fff7df', delay: 155, drift: -145, left: 50, rise: -130, rotation: 145, shape: 'is-ribbon' },
  { color: '#b98a3d', delay: 105, drift: -92, left: 52, rise: -104, rotation: -160, shape: 'is-dot' },
  { color: '#f8ebc7', delay: 140, drift: -24, left: 48, rise: -124, rotation: 185, shape: 'is-ribbon' },
  { color: '#d5b06a', delay: 170, drift: 30, left: 50, rise: -108, rotation: -175, shape: 'is-dot' },
  { color: '#fff7df', delay: 120, drift: 86, left: 51, rise: -136, rotation: 165, shape: 'is-ribbon' },
  { color: '#b98a3d', delay: 190, drift: 132, left: 49, rise: -112, rotation: -145, shape: 'is-dot' },
  { color: '#f8ebc7', delay: 145, drift: 176, left: 52, rise: -126, rotation: 200, shape: 'is-ribbon' },
  { color: '#d5b06a', delay: 175, drift: 215, left: 50, rise: -98, rotation: -205, shape: 'is-dot' },
];

export function launchConfettiBurst(hasAlreadyPlayed: boolean) {
  return !hasAlreadyPlayed;
}
