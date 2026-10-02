export interface RsvpResponse {
  guestName: string;
  guestCount: number;
  message?: string;
}

export function isValidRsvpResponse(response: RsvpResponse): boolean {
  return response.guestName.trim().length > 0
    && Number.isSafeInteger(response.guestCount)
    && response.guestCount > 0;
}

export function buildRsvpMessage(response: RsvpResponse, coupleNames: string): string {
  const name = response.guestName.trim();
  const details = [
    `Wedding RSVP for ${coupleNames}, Pune`,
    '',
    `Name: ${name}`,
    `Guests: ${response.guestCount}`,
  ];

  const note = response.message?.trim();
  if (note) {
    details.push(`Message: ${note}`);
  }

  return details.join('\n');
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string | null {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15 || /^0+$/.test(digits)) {
    return null;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
