import { mockLessons } from "../mocks/lessons";

test("POST /api/lessons/generate returns 201 with mock lesson", async () => {
  // Mock fetch to avoid hitting real API
  global.fetch = jest.fn((url: URL | RequestInfo) =>
    url.toString().includes("/api/lessons")
      ? Promise.resolve({
          ok: true,
          status: 201,
          json: async () => ({
            content: {
              grammar: `mock lesson: cachorro at B2`,
              vocabulary: "",
              logic: "",
              culture: "",
              communication: "",
            },
            mnemonic: "**→** cachorro",
            difficulty: "B2",
            pillar: "grammar",
          }),
        } as Response)
      : Promise.reject(new Error("Mock not configured"))
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
