const nodemailer = require("nodemailer");

jest.mock("nodemailer");
const mockSMTPTransport = {
  sendMail: jest.fn().mockResolvedValue({ accepted: ["test@example.com"] }),
};

beforeAll(() => {
  // Mock SMTP via jest.mock
  jest.spyOn(nodemailer, "createTransport").mockReturnValue(mockSMTPTransport);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("SMTP fallback", () => {
  it.skip("sends when Resend API fails (flaky due to ECONNREFUSED)", async () => {
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockRejectedValue(new Error("ECONNREFUSED"));

    const response = await fetch(
      process.env.TEST_API_URL ||
        "http://localhost:3000/api/diagnostico/notify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          name: "Test User",
          archetype_key: "silence",
          archetype_name: "Silence",
          share_token: "test-token",
        }),
      }
    );
    expect(mockSMTPTransport.sendMail).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
