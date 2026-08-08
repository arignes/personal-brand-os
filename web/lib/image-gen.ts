// Gemini image generation (model gemini-2.5-flash-image, aka Nano Banana).
// Returns a data: URL so the client can show/download it directly.
import "server-only";

export function geminiImageAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export async function generateImage(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini image failed: ${res.status} ${await res.text()}`);

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { inlineData?: { mimeType: string; data: string } }[] } }[];
  };
  const img = (json.candidates?.[0]?.content?.parts ?? []).find((p) => p.inlineData)?.inlineData;
  if (!img) throw new Error("No image returned");
  return `data:${img.mimeType};base64,${img.data}`;
}
