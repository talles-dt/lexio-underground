// app/api/diagnostico.ts (Expo Router API wrapper)
export { POST } from "./diagnostico/route";

// Add GET for testing
export async function GET() {
 return new Response(JSON.stringify({ message: "Diagnostic Quiz API" }), {
 status: 200,
 headers: { "Content-Type": "application/json" },
 });
}