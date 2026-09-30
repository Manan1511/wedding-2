export interface ChampagneConfettiPiece {
  color: '#f8ebc7' | '#d5b06a' | '#fff7df' | '#b98a3d';
  delay: number;
  drift: number;
  left: number;
  rise: number;
  rotation: number;
  shape: 'is-ribbon' | 'is-diamond' | 'is-cross';
}

const palette: ChampagneConfettiPiece['color'][] = ['#f8ebc7', '#d5b06a', '#fff7df', '#b98a3d'];
const shapes: ChampagneConfettiPiece['shape'][] = [
  'is-ribbon', 'is-diamond', 'is-ribbon', 'is-cross', 'is-diamond',
  'is-ribbon', 'is-diamond', 'is-ribbon', 'is-cross', 'is-diamond',
];
const trajectories = [-275, -245, -218, -192, -168, -144, -121, -98, -76, -54, -32, -12, 15, 38, 61, 84, 108, 133, 158, 184, 211, 238, 264, -228, -174, -114, -48, 72, 146, 224];

export const champagneConfettiPieces: ChampagneConfettiPiece[] = trajectories.map((drift, index) => ({
  color: palette[index % palette.length],
  delay: (index % 10) * 28,
  drift,
  left: 50 + ((index % 5) - 2) * 1.8,
  rise: -178 - (index % 6) * 22,
  rotation: (index % 2 === 0 ? 1 : -1) * (165 + (index % 5) * 25),
  shape: shapes[index % shapes.length],
}));

export function launchConfettiBurst(hasAlreadyPlayed: boolean) {
  return !hasAlreadyPlayed;
}
