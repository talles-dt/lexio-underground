// Mock endpoint for Expo/Next.js builds
if (process.env.NODE_ENV === "test" || process.env.BUILD_ENV === "EXPO") {
  async function POST(req: Request) {
    return new Response(JSON.stringify({ fallback: true }), { status: 200 });
  }

  module.exports = { POST };
}
