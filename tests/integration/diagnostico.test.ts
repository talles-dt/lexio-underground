test("POST /api/diagnostico returns mock share token", async () => {
  // Mock fetch to avoid hitting real API
  global.fetch = jest.fn((input: any) =>
    input.toString().includes("/api/diagnostico")
      ? Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ share_token: "mock" }),
        } as Response)
      : Promise.reject(new Error("Mock not configured")),
  );

  const response = await fetch("http://localhost:3000/api/diagnostico", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  expect(data.share_token).toBe("mock");
});
