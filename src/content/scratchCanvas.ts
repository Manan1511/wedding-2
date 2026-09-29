export function resizeScratchCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  bounds: { width: number; height: number },
  pixelRatio: number,
  preserveContents: boolean,
  createSnapshot: () => HTMLCanvasElement = () => document.createElement('canvas'),
): boolean {
  const width = Math.round(bounds.width * pixelRatio);
  const height = Math.round(bounds.height * pixelRatio);

  if (canvas.width === width && canvas.height === height) return false;

  let snapshot: HTMLCanvasElement | null = null;
  if (preserveContents && canvas.width > 0 && canvas.height > 0) {
    snapshot = createSnapshot();
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    const snapshotContext = snapshot.getContext('2d');
    if (snapshotContext) {
      snapshotContext.drawImage(canvas, 0, 0, snapshot.width, snapshot.height);
    } else {
      snapshot = null;
    }
  }

  canvas.width = width;
  canvas.height = height;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  if (snapshot) {
    context.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, bounds.width, bounds.height);
  }

  return true;
}
