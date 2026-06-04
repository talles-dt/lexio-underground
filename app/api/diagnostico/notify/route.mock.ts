// Mock endpoint for Expo/Next.js builds

export async function POST(req: Request) {
  return new Response(JSON.stringify({ fallback: true }), { status: 200 });
}
