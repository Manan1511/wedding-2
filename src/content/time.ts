export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
}

export function getCountdown(targetDateTime: string, now: Date = new Date()): Countdown {
  const target = Date.parse(targetDateTime);

  if (!Number.isFinite(target)) {
    throw new RangeError('The wedding date must be a valid date and time.');
  }

  const totalSeconds = Math.max(0, Math.floor((target - now.getTime()) / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    complete: totalSeconds === 0,
  };
}
