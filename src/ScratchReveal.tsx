import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { resizeScratchCanvas } from './content/scratchCanvas';

interface ScratchRevealProps {
  date: string;
  dateTime: string;
  textureSrc: string;
  time: string;
}

interface ScratchPoint {
  x: number;
  y: number;
}

export function ScratchReveal({ date, dateTime, textureSrc, time }: ScratchRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const previousPoint = useRef<ScratchPoint | null>(null);
  const movesSinceCheck = useRef(0);
  const hasScratched = useRef(false);
  const textureRef = useRef<HTMLImageElement | null>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [coatingReady, setCoatingReady] = useState(false);
  const [interactionStarted, setInteractionStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '160px' });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearViewport) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context) return;

    const drawFallbackCoating = (width: number, height: number) => {
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#d8c18f');
      gradient.addColorStop(0.48, '#f1e5c9');
      gradient.addColorStop(1, '#c4a86f');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.save();
      context.globalAlpha = 0.13;
      context.strokeStyle = '#fffaf0';
      context.lineWidth = 1;
      for (let offset = -height; offset < width; offset += 17) {
        context.beginPath();
        context.moveTo(offset, 0);
        context.lineTo(offset + height, height);
        context.stroke();
      }
      context.restore();
    };

    const paintCoating = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const resized = resizeScratchCanvas(
        canvas,
        context,
        bounds,
        pixelRatio,
        hasScratched.current,
      );

      if (hasScratched.current) {
        if (resized) previousPoint.current = null;
        return;
      }

      context.clearRect(0, 0, bounds.width, bounds.height);

      const texture = textureRef.current;
      if (texture?.complete && texture.naturalWidth > 0) {
        context.drawImage(texture, 0, 0, bounds.width, bounds.height);
      } else {
        drawFallbackCoating(bounds.width, bounds.height);
      }

      context.strokeStyle = 'rgb(255 250 240 / 0.78)';
      context.lineWidth = 1;
      context.strokeRect(12, 12, bounds.width - 24, bounds.height - 24);
      setCoatingReady(true);
    };

    paintCoating();

    const texture = new Image();
    texture.loading = 'lazy';
    texture.decoding = 'async';
    texture.onload = () => {
      textureRef.current = texture;
      paintCoating();
    };
    texture.src = textureSrc;

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(paintCoating);
    resizeObserver?.observe(canvas);

    return () => resizeObserver?.disconnect();
  }, [nearViewport, textureSrc]);

  function revealDateAndTime() {
    isDrawing.current = false;
    activePointerId.current = null;
    setInteractionStarted(true);
    setRevealed(true);
  }

  function eraseAt(point: ScratchPoint, from: ScratchPoint | null = null) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context) return;

    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 54;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(from?.x ?? point.x, from?.y ?? point.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.beginPath();
    context.arc(point.x, point.y, 27, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function revealIfScratchedEnough() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context || revealed) return;

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const sampleStep = 4 * 20;
    let samples = 0;
    let cleared = 0;

    for (let alphaIndex = 3; alphaIndex < data.length; alphaIndex += sampleStep) {
      samples += 1;
      if (data[alphaIndex] < 32) cleared += 1;
    }

    if (samples > 0 && cleared / samples >= 0.42) revealDateAndTime();
  }

  function getPoint(event: ReactPointerEvent<HTMLCanvasElement>): ScratchPoint {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!coatingReady || activePointerId.current !== null || revealed || event.button > 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawing.current = true;
    activePointerId.current = event.pointerId;
    hasScratched.current = true;
    setInteractionStarted(true);
    const point = getPoint(event);
    previousPoint.current = point;
    eraseAt(point);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || activePointerId.current !== event.pointerId) return;
    event.preventDefault();
    const point = getPoint(event);
    eraseAt(point, previousPoint.current);
    previousPoint.current = point;
    movesSinceCheck.current += 1;

    if (movesSinceCheck.current >= 8) {
      movesSinceCheck.current = 0;
      revealIfScratchedEnough();
    }
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (activePointerId.current !== event.pointerId) return;
    isDrawing.current = false;
    activePointerId.current = null;
    previousPoint.current = null;
    revealIfScratchedEnough();
  }

  return (
    <section className="scratch-section" ref={sectionRef} aria-labelledby="scratch-title">
      <div className="scratch-rule" aria-hidden="true"><span /><i>✝</i><span /></div>
      <div className="scratch-inner">
        <p className="eyebrow eyebrow-light">A DAY HELD IN GRACE</p>
        <h2 id="scratch-title">A date to hold<br />close to your heart.</h2>
        <p className="scratch-intro">Scratch to reveal the wedding date and time.</p>

        <div className={`scratch-card${coatingReady ? ' is-coated' : ''}${revealed ? ' is-revealed' : ''}`}>
          <div
            className="scratch-reveal-content"
            id="scratch-reveal-content"
            aria-hidden={!revealed}
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="scratch-content-label">THE WEDDING DAY</p>
            <p className="scratch-date"><time dateTime={dateTime}>{date}</time></p>
            <p className="scratch-time">{time}</p>
          </div>
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          />
          {!interactionStarted && !revealed && (
            <div className="scratch-hint" aria-hidden="true">
              <span>SCRATCH HERE</span>
              <small>Reveal the date and time</small>
            </div>
          )}
        </div>

        <button
          className="scratch-reveal-button"
          type="button"
          aria-controls="scratch-reveal-content"
          aria-expanded={revealed}
          disabled={revealed}
          onClick={revealDateAndTime}
        >
          {revealed ? 'Date and time revealed' : 'Reveal date and time'}
        </button>
      </div>
    </section>
  );
}
