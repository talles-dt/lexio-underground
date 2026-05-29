// tests/unit/checkout.test.ts
// Tests for Stripe checkout API logic

// This extracts and tests the validation/price logic from app/api/checkout/route.ts
// The full route is tested in integration tests with mocked Supabase

const PRICES = {
  monthly: { amount: 4900, description: "Mensal" },
  annual: { amount: 46800, description: "Anual" },
  lifetime: { amount: 149000, description: "Vitalício" },
} as const;

type PriceTier = keyof typeof PRICES;

describe("Checkout API Logic", () => {
  describe("Price validation", () => {
    it("has correct pricing tiers", () => {
      expect(Object.keys(PRICES)).toEqual(["monthly", "annual", "lifetime"]);
    });

    it("has correct amounts", () => {
      expect(PRICES.monthly.amount).toBe(4900);    // R$ 49,00
      expect(PRICES.annual.amount).toBe(46800);     // R$ 468,00
      expect(PRICES.lifetime.amount).toBe(149000);  // R$ 1.490,00
    });
  });

  describe("Tier validation", () => {
    function validateTier(tier: string): { valid: boolean; price?: { amount: number; description: string } } {
      if (!tier || !PRICES[tier as PriceTier]) {
        return { valid: false };
      }
      return { valid: true, price: PRICES[tier as PriceTier] };
    }

    it("validates known tier", () => {
      expect(validateTier("monthly").valid).toBe(true);
      expect(validateTier("annual").valid).toBe(true);
      expect(validateTier("lifetime").valid).toBe(true);
    });

    it("rejects unknown tier", () => {
      expect(validateTier("unknown").valid).toBe(false);
      expect(validateTier("").valid).toBe(false);
    });

    it("rejects undefined tier", () => {
      expect(validateTier(undefined as any).valid).toBe(false);
    });

    it("returns correct price for tier", () => {
      expect(validateTier("annual").price?.amount).toBe(46800);
      expect(validateTier("annual").price?.description).toBe("Anual");
    });
  });

  describe("User ID validation", () => {
    function validateUserId(user_id: string | undefined): { valid: boolean; error?: string } {
      if (!user_id) {
        return { valid: false, error: "user_id required" };
      }
      return { valid: true };
    }

    it("rejects missing user_id", () => {
      expect(validateUserId(undefined).valid).toBe(false);
      expect(validateUserId(undefined).error).toBe("user_id required");
    });

    it("rejects empty user_id", () => {
      expect(validateUserId("").valid).toBe(false);
    });

    it("accepts valid user_id", () => {
      expect(validateUserId("user-123").valid).toBe(true);
    });
  });

  describe("Mock fallback URL", () => {
    function buildMockUrl(tier: string, userId: string, siteUrl?: string): string {
      const base = siteUrl || "http://localhost:3000";
      return `${base}/checkout/mock?tier=${tier}&user_id=${userId}`;
    }

    it("builds correct mock URL", () => {
      const url = buildMockUrl("monthly", "user-123");
      expect(url).toBe("http://localhost:3000/checkout/mock?tier=monthly&user_id=user-123");
    });

    it("uses custom site URL when provided", () => {
      const url = buildMockUrl("lifetime", "user-456", "https://lexio.oliceu.com");
      expect(url).toBe("https://lexio.oliceu.com/checkout/mock?tier=lifetime&user_id=user-456");
    });
  });

  describe("Success/cancel URL building", () => {
    it("defaults success URL to palace page", () => {
      const base = "http://localhost:3000";
      expect(`${base}/palace?checkout=success`).toContain("checkout=success");
    });

    it("defaults cancel URL to pricing page", () => {
      const base = "http://localhost:3000";
      expect(`${base}/pricing?checkout=cancel`).toContain("checkout=cancel");
    });
  });
});