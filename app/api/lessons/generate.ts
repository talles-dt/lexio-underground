// app/api/lessons/generate.ts (Expo Router API wrapper)
export { POST } from "./generate/route";

export async function GET() {
  return new Response(JSON.stringify({ message: "Lesson Generator API" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
