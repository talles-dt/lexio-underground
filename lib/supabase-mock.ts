// Mock for Supabase client
export const supabase = {
  auth: {
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: { id: "mock-user-id", email: "mock@example.com" } },
      error: null,
    }),
  },
};
