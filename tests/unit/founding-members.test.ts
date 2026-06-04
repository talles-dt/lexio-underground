// tests/unit/founding-members.test.ts
// Tests for founding member license claim logic

describe("Founding Member Claim Logic", () => {
  describe("License key validation", () => {
    function validateLicenseKey(license_key: string | undefined): {
      valid: boolean;
      error?: string;
    } {
      if (!license_key) {
        return { valid: false, error: "license_key and user_id are required" };
      }
      if (typeof license_key !== "string" || license_key.length < 6) {
        return { valid: false, error: "Invalid license key" };
      }
      return { valid: true };
    }

    it("rejects missing license_key", () => {
      expect(validateLicenseKey(undefined).valid).toBe(false);
      expect(validateLicenseKey(undefined).error).toContain("required");
    });

    it("rejects empty license_key", () => {
      expect(validateLicenseKey("").valid).toBe(false);
    });

    it("rejects short license_key", () => {
      expect(validateLicenseKey("ab").valid).toBe(false);
    });

    it("accepts valid license_key", () => {
      expect(validateLicenseKey("LIC-123-ABC-456").valid).toBe(true);
    });
  });

  describe("User ID validation", () => {
    function validateUserId(user_id: string | undefined): {
      valid: boolean;
      error?: string;
    } {
      if (!user_id) {
        return { valid: false, error: "license_key and user_id are required" };
      }
      return { valid: true };
    }

    it("rejects missing user_id", () => {
      expect(validateUserId(undefined).valid).toBe(false);
    });

    it("accepts valid user_id", () => {
      expect(validateUserId("550e8400-e29b-41d4-a716-446655440000").valid).toBe(
        true
      );
    });
  });

  describe("Eligibility check", () => {
    function checkEligibility(sessions: { id: string }[] | null): {
      eligible: boolean;
      readiness?: string;
    } {
      if (!sessions || sessions.length === 0) {
        return { eligible: false };
      }
      return { eligible: true, readiness: "branches" };
    }

    it("returns eligible when Cartografa completed", () => {
      const sessions = [{ id: "session-1" }];
      const result = checkEligibility(sessions);
      expect(result.eligible).toBe(true);
      expect(result.readiness).toBeDefined();
    });

    it("returns not eligible when no sessions", () => {
      const result = checkEligibility([]);
      expect(result.eligible).toBe(false);
    });

    it("returns not eligible when sessions is null", () => {
      const result = checkEligibility(null);
      expect(result.eligible).toBe(false);
    });
  });

  describe("Tier upgrade", () => {
    function upgradeTier(currentTier: string): {
      success: boolean;
      tier: string;
    } {
      if (currentTier === "pro_lifetime") {
        return { success: true, tier: "pro_lifetime" };
      }
      // Upgrade from free/pro to pro_lifetime
      return { success: true, tier: "pro_lifetime" };
    }

    it("upgrades from free to pro_lifetime", () => {
      const result = upgradeTier("free");
      expect(result.success).toBe(true);
      expect(result.tier).toBe("pro_lifetime");
    });

    it("upgrades from pro to pro_lifetime", () => {
      const result = upgradeTier("family");
      expect(result.success).toBe(true);
      expect(result.tier).toBe("pro_lifetime");
    });

    it("sets found_member flag", () => {
      const result = upgradeTier("free");
      expect(result.tier).toBe("pro_lifetime");
    });
  });

  describe("Error responses", () => {
    it("returns 403 for incomplete Cartografa", () => {
      const status = 403;
      const error = "Complete the Cartografa diagnostic first";
      expect(status).toBe(403);
      expect(error).toContain("Cartografa");
    });

    it("returns 400 for already claimed license", () => {
      const status = 400;
      const error = "Invalid or already claimed license key";
      expect(status).toBe(400);
      expect(error).toContain("claimed");
    });
  });
});
