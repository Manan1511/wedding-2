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
  };
  rsvpWhatsAppNumber: string;
  artwork: {
    hero: string;
    heroWide: string;
    bouquet: string;
    closing: string;
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
  },
  rsvpWhatsAppNumber: 'REPLACE_WITH_HOST_NUMBER',
  artwork: {
    hero: '/images/wedding-hero-sketch.webp',
    heroWide: '/images/wedding-hero-wide-sketch.webp',
    bouquet: '/images/wedding-bouquet-sketch.webp',
    closing: '/images/wedding-blessing-sketch.webp',
    curtain: '/images/wedding-curtain-watercolor.webp',
    curtainWide: '/images/wedding-curtain-watercolor-wide.webp',
  },
};

export const coupleNames = `${wedding.couple.firstName} & ${wedding.couple.secondName}`;
