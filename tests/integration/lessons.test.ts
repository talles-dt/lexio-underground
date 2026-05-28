import { mockLessons } from "../mocks/lessons";

test("POST /api/lessons/generate returns 201 with mock lesson", async () => {
  // Mock fetch to avoid hitting real API
  // @ts-expect-error: Mock lacks Response fields
  global.fetch = jest.fn((url) =>
    url.toString().includes("/api/lessons")
      ? Promise.resolve({
          ok: true,
          json: async () => mockLessons,
        })
      : Promise.reject(new Error("Mock not configured")),
  );

  const response = await fetch("http://localhost:3000/api/lessons/generate", {
    method: "POST",
    body: JSON.stringify({
      pillar: "grammar",
      difficulty: "B2",
      interest: "cachorro",
    }),
  });

  const data = await response.json();
  expect(response.status).toBe(201);
  expect(data.content.grammar).toMatch(/mock/);
});
