export async function translateText(
  text: string,
  targetLanguage: string,
): Promise<string | null> {
  if (!text.trim()) return null;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const translated = data[0]
      .filter((part: unknown[]) => part[0])
      .map((part: unknown[]) => part[0])
      .join('');

    return translated || null;
  } catch {
    return null;
  }
}
