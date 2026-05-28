// Mock fetch for tests
export const mockFetchFailure = (url: string) => {
  jest.spyOn(global, "fetch").mockImplementation((input) => {
    if (typeof input === "string" && input.startsWith(url)) {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as Response);
    }
    return fetch(input);
  });
};
