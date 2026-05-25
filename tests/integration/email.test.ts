// tests/integration/email.test.ts
// Mock test for SMTP fallback in Resend failures

test("SMTP fallback sends when Resend API fails", async () => {
  // Mock Resend to throw error
  jest.mock("resend", () => ({
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: () => Promise.reject(new Error("Resend down")),
      },
    })),
  }));

  // Mock Nodemailer
  const mockSendMail = jest.fn().mockResolvedValue({});
  jest.mock("nodemailer", () => ({
    createTransport: () => ({
      sendMail: mockSendMail,
    }),
  }));

  // Test
  const response = await fetch("http://localhost:3000/api/diagnostico/notify", {
    method: "POST",
    body: JSON.stringify({
      email: "test@example.com",
      name: "Test",
      archetype_key: "silence",
      archetype_name: "O Silêncio",
      share_token: "test-token",
    }),
  });

  const data = await response.json();
  expect(response.status).toBe(200);
  expect(data.fallback).toBe(true);
  expect(mockSendMail).toHaveBeenCalled();
});
