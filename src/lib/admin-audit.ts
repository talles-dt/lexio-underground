import { supabaseAdmin } from "@/lib/supabase";

/**
 * Write an entry to the admin audit log.
 * Fire-and-forget — does not throw.
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType: string | null,
  targetId: string | null,
  metadata: Record<string, unknown> | null,
  ipAddress: string
): Promise<void> {
  try {
    await supabaseAdmin.from("admin_audit_log").insert({
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata: metadata || {},
      ip_address: ipAddress,
    });
  } catch {
    // Audit log failure should not break the main flow
    console.error("Failed to write admin audit log:", action);
  }
}
