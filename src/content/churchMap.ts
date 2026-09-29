export type ChurchMapCentre = {
  x: number;
  y: number;
  zoom: number;
};

export function buildChurchMapTileUrls({ x, y, zoom }: ChurchMapCentre): string[] {
  const tileUrls: string[] = [];

  for (let row = -1; row <= 1; row += 1) {
    for (let column = -1; column <= 1; column += 1) {
      tileUrls.push(`https://tile.openstreetmap.org/${zoom}/${x + column}/${y + row}.png`);
    }
  }

  return tileUrls;
}
