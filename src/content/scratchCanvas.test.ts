import { describe, expect, it, vi } from 'vitest';
import { resizeScratchCanvas } from './scratchCanvas';

interface FakeCanvas {
  width: number;
  height: number;
  pixels: string;
  getContext: () => FakeContext;
}

interface FakeContext {
  drawImage: (source: FakeCanvas) => void;
  setTransform: ReturnType<typeof vi.fn>;
}

function createFakeCanvas(width: number, height: number, pixels: string): FakeCanvas {
  let bitmapWidth = width;
  let bitmapHeight = height;
  let bitmapPixels = pixels;
  const canvas: FakeCanvas = {
    get width() { return bitmapWidth; },
    set width(value) { bitmapWidth = value; bitmapPixels = ''; },
    get height() { return bitmapHeight; },
    set height(value) { bitmapHeight = value; bitmapPixels = ''; },
    get pixels() { return bitmapPixels; },
    set pixels(value) { bitmapPixels = value; },
    getContext: () => context,
  };
  const context: FakeContext = {
    drawImage: (source) => { canvas.pixels = source.pixels; },
    setTransform: vi.fn(),
  };

  return canvas;
}

describe('scratch canvas resizing', () => {
  it('preserves cleared coating and updates the backing store after a layout resize', () => {
    const canvas = createFakeCanvas(400, 200, 'partially-cleared coating');
    const snapshot = createFakeCanvas(0, 0, '');
    const context = canvas.getContext();
    const resized = resizeScratchCanvas(
      canvas as unknown as HTMLCanvasElement,
      context as unknown as CanvasRenderingContext2D,
      { width: 360, height: 180 },
      2,
      true,
      () => snapshot as unknown as HTMLCanvasElement,
    );

    expect(resized).toBe(true);
    expect(snapshot.pixels).toBe('partially-cleared coating');
    expect(canvas).toMatchObject({ width: 720, height: 360, pixels: 'partially-cleared coating' });
    expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it('does not snapshot or resize when the backing dimensions are already current', () => {
    const canvas = createFakeCanvas(720, 360, 'partially-cleared coating');
    const createSnapshot = vi.fn(() => createFakeCanvas(0, 0, ''));

    const resized = resizeScratchCanvas(
      canvas as unknown as HTMLCanvasElement,
      canvas.getContext() as unknown as CanvasRenderingContext2D,
      { width: 360, height: 180 },
      2,
      true,
      () => createSnapshot() as unknown as HTMLCanvasElement,
    );

    expect(resized).toBe(false);
    expect(createSnapshot).not.toHaveBeenCalled();
    expect(canvas.pixels).toBe('partially-cleared coating');
  });
});
