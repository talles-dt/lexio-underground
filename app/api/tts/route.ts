import { NextResponse } from "next/server";
// Quarantined by the pilot release gate. See docs/MVP-IMPLEMENTATION.md.
export async function POST() { return NextResponse.json({ error: "Recurso ainda não liberado neste piloto." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
export async function GET() { return NextResponse.json({ error: "Recurso ainda não liberado neste piloto." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
