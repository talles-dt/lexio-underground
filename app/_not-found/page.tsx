"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Not Found</h1>
      <p>
        Return{" "}
        <Link href="/" style={{ textDecoration: "underline" }}>
          home
        </Link>
        .
      </p>
    </div>
  );
}
