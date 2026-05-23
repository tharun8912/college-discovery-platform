/** Production Render API — fallback when NEXT_PUBLIC_API_URL is unset on Vercel. */
export const PRODUCTION_API_URL =
  "https://college-discovery-platform-mrku.onrender.com";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_API_URL;
  }

  return "http://localhost:5000";
}
