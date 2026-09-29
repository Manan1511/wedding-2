export type EntryAudio = Pick<HTMLAudioElement, 'play' | 'pause'>;

export async function setEntryMusicPlayback(
  audio: EntryAudio,
  shouldPlay: boolean,
): Promise<boolean> {
  if (!shouldPlay) {
    audio.pause();
    return false;
  }

  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}
