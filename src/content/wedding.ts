export interface WeddingConfig {
  couple: {
    firstName: string;
    secondName: string;
    parents: {
      first: string[];
      second: string[];
    };
  };
  scripture: {
    text: string;
    reference: string;
  };
  ceremony: {
    dateTime: string;
    venue: string;
    city: string;
    address: string;
    mapUrl: string;
    map: {
      zoom: number;
      tileX: number;
      tileY: number;
      markerX: string;
      markerY: string;
    };
  };
  reception: {
    dateTime: string;
    venue: string;
    city: string;
    address: string;
    mapUrl: string;
    map: {
      zoom: number;
      tileX: number;
      tileY: number;
      markerX: string;
      markerY: string;
    };
  };
  rsvpWhatsAppNumber: string;
  music: {
    entryTrack: string;
  };
  artwork: {
    hero: string;
    heroWide: string;
    bouquet: string;
    closing: string;
    scratchSurface: string;
    curtain: string;
    curtainWide: string;
  };
}

export const wedding: WeddingConfig = {
  couple: {
    firstName: 'Travis Hale',
    secondName: 'Sayali Dharpal',
    parents: {
      first: ['Late Mr Tyrone Duddley Hale', 'Late Mrs Janet Tyrone Hale'],
      second: ['Mr. Narendra Devidasrao Dharpal', 'Mrs. Meena Narendra Dharpal'],
    },
  },
  scripture: {
    text: 'I have found the one whom my soul loves.',
    reference: 'Song of Songs 3:4',
  },
  ceremony: {
    dateTime: '2026-12-26T16:00:00+05:30',
    venue: "St. Xavier's Church",
    city: 'Pune, India',
    address: 'St. Xavier’s Church, Pune',
    mapUrl: 'https://maps.app.goo.gl/C6eYegm5jJE84UL57',
    map: {
      zoom: 16,
      tileX: 46216,
      tileY: 29337,
      markerX: '58.5%',
      markerY: '52.5%',
    },
  },
  reception: {
    dateTime: '2026-12-26T18:00:00+05:30',
    venue: 'The Imperial Hall',
    city: 'The Corinthians Resorts and Club, Pune',
    address: 'The Imperial Hall, The Corinthians Resorts and Club, Pune',
    mapUrl: 'https://maps.app.goo.gl/sJ23yCjgjnBZE7iR7',
    map: {
      zoom: 16,
      tileX: 46224,
      tileY: 29347,
      markerX: '54.1%',
      markerY: '33.9%',
    },
  },
  rsvpWhatsAppNumber: '+91 88057 75117',
  music: {
    entryTrack: '/audio/entry-music.mp3',
  },
  artwork: {
    hero: '/images/wedding-hero-sketch-v2.webp',
    heroWide: '/images/wedding-hero-wide-sketch-v2.webp',
    bouquet: '/images/wedding-bouquet-sketch.webp',
    closing: '/images/wedding-blessing-sketch.webp',
    curtain: '/images/wedding-curtain-watercolor.webp',
    curtainWide: '/images/wedding-curtain-watercolor-wide.webp',
    scratchSurface: '/images/scratch-champagne.webp',
  },
};

export const coupleNames = `${wedding.couple.firstName} & ${wedding.couple.secondName}`;
