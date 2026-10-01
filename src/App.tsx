import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { buildRsvpMessage, buildWhatsAppUrl, isValidRsvpResponse } from './content/rsvp';
import type { RsvpResponse } from './content/rsvp';
import { introTimeline, shouldPlayIntro, waitForIntroArtwork } from './content/intro';
import { setEntryMusicPlayback } from './content/music';
import { buildChurchMapTileUrls } from './content/churchMap';
import { coupleNames, wedding } from './content/wedding';
import type { WeddingConfig } from './content/wedding';
import { ScratchReveal } from './ScratchReveal';

const ceremonyTime = new Date(wedding.ceremony.dateTime);
const weddingDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
}).format(ceremonyTime);
const shortWeddingDate = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
}).format(ceremonyTime).toUpperCase();
const weddingTime = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata',
}).format(ceremonyTime);
const receptionTime = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata',
}).format(new Date(wedding.reception.dateTime));

function CrossMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 48" aria-hidden="true" fill="none">
      <path d="M18 2v44M3 16h30" stroke="currentColor" strokeWidth="1.2" />
      <path d="M18 2c-3 6-3 10 0 14 3-4 3-8 0-14ZM3 16c6-3 10-3 15 0-5 3-9 3-15 0ZM33 16c-6-3-10-3-15 0 5 3 9 3 15 0Z" fill="currentColor" />
    </svg>
  );
}

function BranchMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" aria-hidden="true">
      <path d="M4 34C36 31 71 20 116 4M28 30C24 21 19 18 12 18c3 8 8 12 16 12ZM47 25c-1-9 2-14 8-18 2 8 0 13-7 19ZM69 19c1-8 6-12 13-13 0 8-4 13-12 15ZM88 13c4-6 10-8 17-7-3 7-8 10-16 10Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 28c-2-6-1-11 3-15 4 6 3 11-2 16ZM59 21c-4-5-5-10-2-16 6 5 7 10 3 16Z" fill="currentColor" fillOpacity=".32" />
    </svg>
  );
}

function InvitationIntro({
  phase,
  onSkip,
  onArtworkReady,
  artworkReady,
}: {
  phase: 'playing' | 'exiting';
  onSkip: () => void;
  onArtworkReady: (decoded: boolean) => void;
  artworkReady: boolean;
}) {
  const introRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const timing = {
    '--intro-bouquet-delay': `${introTimeline.bouquetAtMs}ms`,
  } as CSSProperties;

  useEffect(() => {
    skipButtonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const introImages = Array.from(introRef.current?.querySelectorAll('img') ?? []);
    const heroImage = document.querySelector<HTMLImageElement>('.hero-art img');
    const images = heroImage ? [...introImages, heroImage] : introImages;

    void Promise.all([waitForIntroArtwork(images), document.fonts.ready]).then(([decoded]) => {
      if (!cancelled) onArtworkReady(decoded);
    });

    return () => {
      cancelled = true;
    };
  }, [onArtworkReady]);

  return (
    <div
      ref={introRef}
      className={`invitation-intro ${phase === 'exiting' ? 'is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Opening ${coupleNames} wedding invitation`}
      data-artwork-ready={artworkReady}
      style={timing}
    >
      <div className="intro-curtain intro-curtain-left" aria-hidden="true">
        <picture className="intro-curtain-art">
          <source media="(orientation: landscape)" srcSet={wedding.artwork.curtainWide} />
          <img src={wedding.artwork.curtain} alt="" loading="lazy" fetchPriority="high" />
        </picture>
      </div>
      <div className="intro-curtain intro-curtain-right" aria-hidden="true">
        <picture className="intro-curtain-art">
          <source media="(orientation: landscape)" srcSet={wedding.artwork.curtainWide} />
          <img src={wedding.artwork.curtain} alt="" loading="lazy" fetchPriority="high" />
        </picture>
      </div>
      <img className="intro-bouquet" src={wedding.artwork.bouquet} alt="" aria-hidden="true" loading="lazy" fetchPriority="high" />

      <button className="intro-skip" ref={skipButtonRef} type="button" onClick={onSkip} disabled={phase === 'exiting'}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`reveal ${className}`} data-reveal style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

function SaveTheDate() {
  return (
    <section className="save-section" id="save-the-date" aria-labelledby="save-title">
      <Reveal className="postcard">
        <div className="postcard-art" aria-hidden="true">
          <div className="postcard-arch">
            <CrossMark className="postcard-cross" />
            <p>WITH GOD AT THE CENTRE</p>
            <div className="postcard-monogram">
              <span className="postcard-initial">{wedding.couple.firstName.charAt(0)}</span>
              <span className="postcard-ampersand">&amp;</span>
              <span className="postcard-initial">{wedding.couple.secondName.charAt(0)}</span>
            </div>
            <BranchMark className="postcard-branch" />
          </div>
        </div>
        <div className="postcard-copy">
          <p className="eyebrow">A DATE TO KEEP</p>
          <h2 id="save-title">Save the<br /><em>date</em></h2>
          <p className="postcard-date">{shortWeddingDate}</p>
          <span className="gold-rule" aria-hidden="true" />
          <p className="postcard-caption">For a joyful day of faith, family,<br />and the beginning of forever.</p>
        </div>
        <span className="postcard-number" aria-hidden="true">01 / 01</span>
      </Reveal>
    </section>
  );
}

function VenueMap({ location, marker }: { location: WeddingConfig['ceremony']; marker: string }) {
  const mapRef = useRef<HTMLElement>(null);
  const [tilesVisible, setTilesVisible] = useState(false);
  const tileUrls = buildChurchMapTileUrls({
    x: location.map.tileX,
    y: location.map.tileY,
    zoom: location.map.zoom,
  });

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!('IntersectionObserver' in window)) {
      setTilesVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTilesVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '220px 0px' });

    observer.observe(map);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={`ceremony-map church-map${tilesVisible ? ' is-ready' : ''}`} ref={mapRef}>
      <figcaption className="sr-only">Map location for {location.address}</figcaption>
      {tilesVisible && (
        <div className="church-map-tiles" aria-hidden="true">
          {tileUrls.map((tileUrl) => <img key={tileUrl} src={tileUrl} alt="" loading="lazy" draggable={false} />)}
        </div>
      )}
      <span
        className="church-map-pin"
        aria-hidden="true"
        style={{ left: location.map.markerX, top: location.map.markerY }}
      >
        <span>{marker}</span>
      </span>
      <span className="church-map-place">{location.venue}</span>
      <a className="church-map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
        © OpenStreetMap contributors
      </a>
    </figure>
  );
}

function CeremonySection() {
  return (
    <section className="ceremony-section" id="ceremony" aria-labelledby="ceremony-title">
      <div className="ceremony-layout">
        <Reveal className="ceremony-intro">
          <p className="eyebrow">THE SACRAMENT OF MATRIMONY</p>
          <CrossMark className="ceremony-cross" />
          <h2 id="ceremony-title">A promise,<br /><em>before God.</em></h2>
          <p className="ceremony-body">With grateful hearts, we invite you to join us as we begin our life together in the house of the Lord.</p>
        </Reveal>
        <div className="ceremony-event">
          <Reveal className="ceremony-details" delay={130}>
            <div className="detail-topline"><span className="eyebrow">THE WEDDING MASS</span><span className="detail-star" aria-hidden="true">✳</span></div>
            <h3 className="ceremony-details-title">Our Day</h3>
            <p className="detail-date">{weddingDate}</p>
            <div className="detail-divider" aria-hidden="true" />
            <p className="detail-time">{weddingTime}</p>
            <p className="detail-place">{wedding.ceremony.venue}<br /><span>{wedding.ceremony.city}</span></p>
            <a className="text-link" href={wedding.ceremony.mapUrl} target="_blank" rel="noreferrer">
              Find the church <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
          <div className="venue-map-wrap">
            <VenueMap location={wedding.ceremony} marker="✝" />
          </div>
        </div>
      </div>
      <div className="ceremony-footer-line" aria-hidden="true"><span /><CrossMark /><span /></div>
    </section>
  );
}

function ReceptionSection() {
  return (
    <section className="reception-section" id="reception" aria-labelledby="reception-title">
      <div className="ceremony-layout">
        <Reveal className="ceremony-intro">
          <p className="eyebrow">THE RECEPTION</p>
          <h2 id="reception-title">Then,<br /><em>we celebrate.</em></h2>
          <p className="ceremony-body">Join us for an evening of celebration as we gather with the people we love.</p>
        </Reveal>
        <div className="ceremony-event">
          <Reveal className="ceremony-details" delay={130}>
            <div className="detail-topline"><span className="eyebrow">THE RECEPTION</span><span className="detail-star" aria-hidden="true">✦</span></div>
            <h3 className="ceremony-details-title">Celebrate with us</h3>
            <p className="detail-date">{weddingDate}</p>
            <div className="detail-divider" aria-hidden="true" />
            <p className="detail-time">{receptionTime} onwards</p>
            <p className="detail-place">{wedding.reception.venue}<br /><span>{wedding.reception.city}</span></p>
            <a className="text-link" href={wedding.reception.mapUrl} target="_blank" rel="noreferrer">
              View venue <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
          <div className="venue-map-wrap">
            <VenueMap location={wedding.reception} marker="•" />
          </div>
        </div>
      </div>
    </section>
  );
}

function RsvpSection() {
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [message, setMessage] = useState('');
  const [prepared, setPrepared] = useState<{ text: string; url: string | null } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response: RsvpResponse = {
      guestName,
      guestCount: Number(guestCount),
      message,
    };
    if (!isValidRsvpResponse(response)) return;

    const text = buildRsvpMessage(response, coupleNames);
    setPrepared({
      text,
      url: buildWhatsAppUrl(wedding.rsvpWhatsAppNumber, text),
    });
  }

  return (
    <section className="rsvp-section" id="rsvp" aria-labelledby="rsvp-title">
      <div className="rsvp-layout">
        <Reveal className="rsvp-intro">
          <p className="eyebrow">YOUR PRESENCE IS OUR PRESENT</p>
          <h2 id="rsvp-title">Will you<br /><em>join us?</em></h2>
          <p>Kindly let us know if you’ll be with us for this blessed beginning.</p>
        </Reveal>

        <Reveal className="rsvp-form-wrap" delay={120}>
          <form className="rsvp-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="guest-name">Your name</label>
            <input
              autoComplete="name"
              id="guest-name"
              name="guestName"
              onChange={(event) => { setGuestName(event.target.value); setPrepared(null); }}
              placeholder="The name on your invitation"
              required
              value={guestName}
            />

            <label className="field-label guest-count-field" htmlFor="guest-count">
              How many guests will attend?
              <input
                id="guest-count"
                name="guestCount"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                onChange={(event) => { setGuestCount(event.target.value); setPrepared(null); }}
                required
                value={guestCount}
              />
            </label>

            <label className="field-label message-field" htmlFor="guest-message">
              A note for the couple <span>(optional)</span>
              <textarea
                id="guest-message"
                name="message"
                onChange={(event) => { setMessage(event.target.value); setPrepared(null); }}
                placeholder="Share a blessing or a note…"
                rows={3}
                value={message}
              />
            </label>

            <button className="button button-navy rsvp-submit" type="submit">
              RSVP <span aria-hidden="true">↗</span>
            </button>

            {prepared && (
              <div className="rsvp-result" role="status" aria-live="polite">
                {prepared.url ? (
                  <>
                    <p>Your reply is ready. It will only be sent if you choose to continue in WhatsApp.</p>
                    <a className="button button-whatsapp" href={prepared.url} rel="noreferrer" target="_blank">
                      Continue in WhatsApp <span aria-hidden="true">↗</span>
                    </a>
                  </>
                ) : (
                  <>
                    <p>Your reply is ready to send once the hosts’ WhatsApp number is added.</p>
                    <details className="message-preview">
                      <summary>Preview your reply</summary>
                      <pre>{prepared.text}</pre>
                    </details>
                  </>
                )}
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <footer className="closing-section">
      <Reveal className="closing-layout">
        <div className="closing-copy">
          <CrossMark className="closing-cross" />
          <p className="eyebrow eyebrow-light">A COVENANT OF LOVE</p>
          <h2>Together,<br /><em>in His grace.</em></h2>
          <p className="closing-names">{coupleNames}</p>
          <span className="closing-date">{shortWeddingDate}</span>
        </div>
        <img className="closing-art" src={wedding.artwork.closing} alt="An ivory Bible, wedding rings, lilies, and a candle on champagne linen" loading="lazy" />
      </Reveal>
      <div className="footer-bottom">
        <span>MADE WITH LOVE &amp; GRATITUDE</span>
        <a href="#home" aria-label="Return to the top">BACK TO THE BEGINNING ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const entryMusicRef = useRef<HTMLAudioElement>(null);
  const focusHeroAfterIntro = useRef(false);
  const [introArtworkReady, setIntroArtworkReady] = useState(false);
  const [introPhase, setIntroPhase] = useState<'playing' | 'exiting' | 'done'>(() => (
    shouldPlayIntro(window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'playing' : 'done'
  ));
  const introIsActive = introPhase !== 'done';

  const handleIntroArtworkReady = useCallback((decoded: boolean) => {
    document.documentElement.classList.remove('invitation-booting');
    if (decoded) {
      setIntroArtworkReady(true);
      return;
    }

    setIntroPhase('done');
  }, []);

  function skipIntro() {
    focusHeroAfterIntro.current = true;
    setIntroPhase('exiting');
  }

  useEffect(() => {
    if (!introIsActive) return;
    document.body.classList.add('invitation-intro-active');
    return () => document.body.classList.remove('invitation-intro-active');
  }, [introIsActive]);

  useEffect(() => {
    if (introPhase !== 'done') return;
    let cancelled = false;
    const heroImage = document.querySelector<HTMLImageElement>('.hero-art img');
    const images = heroImage ? [heroImage] : [];

    void Promise.all([waitForIntroArtwork(images), document.fonts.ready]).then(() => {
      if (!cancelled) document.documentElement.classList.remove('invitation-booting');
    });

    return () => {
      cancelled = true;
    };
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== 'playing' || !introArtworkReady) return;
    const timer = window.setTimeout(() => setIntroPhase('exiting'), introTimeline.curtainOpenAtMs);
    return () => window.clearTimeout(timer);
  }, [introArtworkReady, introPhase]);

  useEffect(() => {
    if (introPhase !== 'exiting') return;
    const timer = window.setTimeout(() => setIntroPhase('done'), introTimeline.fadeDurationMs);
    return () => window.clearTimeout(timer);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== 'done') return;
    const audio = entryMusicRef.current;
    if (!audio) return;

    void setEntryMusicPlayback(audio, true);

    const retryAfterGesture = () => {
      if (audio.paused) void setEntryMusicPlayback(audio, true);
    };

    window.addEventListener('pointerdown', retryAfterGesture, { once: true });
    window.addEventListener('keydown', retryAfterGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', retryAfterGesture);
      window.removeEventListener('keydown', retryAfterGesture);
    };
  }, [introPhase]);

  useEffect(() => {
    if (introPhase === 'done' && focusHeroAfterIntro.current) {
      heroRef.current?.focus({ preventScroll: true });
      focusHeroAfterIntro.current = false;
    }
  }, [introPhase]);

  useEffect(() => {
    document.title = 'Travis Weds Sayali';

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -32px 0px' });

    targets.forEach((target) => observer.observe(target));

    const hero = document.querySelector<HTMLElement>('.hero');
    let frame = 0;
    const handleParallax = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        hero?.style.setProperty('--hero-parallax', `${Math.min(window.scrollY * 0.1, 44)}px`);
      });
    };
    if (hero && window.matchMedia('(min-width: 760px)').matches) {
      window.addEventListener('scroll', handleParallax, { passive: true });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleParallax);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <main
        aria-hidden={introIsActive || undefined}
        inert={introIsActive}
      >
        <section className="hero" id="home" aria-labelledby="hero-title" ref={heroRef} tabIndex={-1}>
          <picture className="hero-art" aria-hidden="true">
            <source media="(min-width: 760px)" srcSet={wedding.artwork.heroWide} />
            <img src={wedding.artwork.hero} alt="" loading="lazy" fetchPriority="high" />
          </picture>
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-topline">
            <a className="monogram hero-corner-label hero-corner-label--champagne" href="#home" aria-label={`${coupleNames} wedding invitation`}>
              <span>{wedding.couple.firstName.charAt(0)}</span><i>&amp;</i><span>{wedding.couple.secondName.charAt(0)}</span>
            </a>
            <span className="hero-top-date hero-corner-label hero-corner-label--champagne">{shortWeddingDate}</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">TOGETHER WITH THEIR FAMILIES</p>
            <div className="hero-title-space">
              <h1 className="hero-names" id="hero-title">
                <span>{wedding.couple.firstName}</span>
                <span className="hero-ampersand">&amp;</span>
                <span>{wedding.couple.secondName}</span>
              </h1>
            </div>
            <div className="hero-scripture">
              <span className="hero-scripture-text">“{wedding.scripture.text}”</span>
              <span className="hero-scripture-ref">({wedding.scripture.reference})</span>
            </div>
          </div>
          <a className="hero-link hero-scroll-cue" href="#our-day">
            <span className="hero-link-label">THE DAY OUR FOREVER BEGINS</span>
            <svg className="hero-link-arrow" viewBox="0 0 16 16" aria-hidden="true" fill="none">
              <path d="M8 2.5v10M4.5 9l3.5 3.5L11.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="hero-bottomline">
            <span className="hero-corner-label hero-corner-label--navy">BY GOD’S GRACE</span>
            <span className="hero-corner-label hero-corner-label--navy">PUNE, INDIA</span>
          </div>
        </section>

        <section className="welcome-section" id="our-day" aria-labelledby="welcome-title">
          <Reveal className="welcome-copy">
            <CrossMark className="welcome-cross" />
            <p className="eyebrow">A JOYFUL BEGINNING</p>
            <h2 id="welcome-title">A love made sacred<br />by <em>His grace.</em></h2>
            <p>With thankful hearts and the blessing of our families, we invite you to witness the beginning of our life together.</p>
            <div className="family-blessings" aria-label="The couple’s parents">
              <h3>With the blessings of their families</h3>
              <div className="family-columns">
                {[
                  { name: wedding.couple.firstName, parents: wedding.couple.parents.first },
                  { name: wedding.couple.secondName, parents: wedding.couple.parents.second },
                ].map((family) => (
                  <div className="family-group" key={family.name}>
                    <h4>{family.name}</h4>
                    <ul>
                      {family.parents.map((parent) => <li key={parent}>{parent}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <ScratchReveal
          date={weddingDate}
          dateTime={wedding.ceremony.dateTime}
          textureSrc={wedding.artwork.scratchSurface}
          time={weddingTime}
        />
        <SaveTheDate />
        <CeremonySection />
        <ReceptionSection />
        <RsvpSection />
        <ClosingSection />
      </main>
      <audio
        ref={entryMusicRef}
        src={wedding.music.entryTrack}
        preload="metadata"
      />
      {introIsActive && (
        <InvitationIntro
          phase={introPhase}
          onSkip={skipIntro}
          onArtworkReady={handleIntroArtworkReady}
          artworkReady={introArtworkReady}
        />
      )}
    </>
  );
}
