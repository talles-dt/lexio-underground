// app/api/family/route.ts
// Family plan API: group creation, member management, invite codes

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/* Supabase admin client                                               */
/* ------------------------------------------------------------------ */

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

/* ------------------------------------------------------------------ */
/* GET — retrieve family group for current user                        */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "user_id query parameter required" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // Find the family group the user belongs to
    const { data: membership, error: memberError } = await supabase
      .from("family_members")
      .select("group_id, role")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (memberError) {
      console.error("Family member lookup error:", memberError);
      return NextResponse.json(
        { error: "Failed to look up family membership" },
        { status: 500 }
      );
    }

    if (!membership) {
      return NextResponse.json({ group: null, members: null });
    }

    // Fetch group details
    const { data: group, error: groupError } = await supabase
      .from("family_groups")
      .select("*")
      .eq("id", membership.group_id)
      .single();

    if (groupError || !group) {
      console.error("Family group lookup error:", groupError);
      return NextResponse.json(
        { error: "Failed to fetch family group" },
        { status: 500 }
      );
    }

    // Fetch all members of the group
    const { data: members, error: membersError } = await supabase
      .from("family_members")
      .select("*")
      .eq("group_id", membership.group_id);

    if (membersError) {
      console.error("Family members lookup error:", membersError);
      return NextResponse.json(
        { error: "Failed to fetch family members" },
        { status: 500 }
      );
    }

    return NextResponse.json({ group, members: members || [] });
  } catch (err) {
    console.error("Family GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/* POST — create group OR invite member (action="invite")              */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "invite") {
      return handleInvite(body);
    }

    return handleCreateGroup(body);
  } catch (err) {
    console.error("Family POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/* Create family group                                                 */
/* ------------------------------------------------------------------ */

async function handleCreateGroup(body: {
  user_id?: string;
  max_members?: number;
}) {
  const { user_id, max_members = 3 } = body;

  if (!user_id) {
    return NextResponse.json(
      { error: "user_id is required" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Check if user already has a family group
  const { data: existing } = await supabase
    .from("family_members")
    .select("group_id")
    .eq("user_id", user_id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "User already belongs to a family group" },
      { status: 409 }
    );
  }

  // Generate invite code (8-char alphanumeric)
  const invite_code = generateInviteCode();

  // Create the family group
  const { data: group, error: groupError } = await supabase
    .from("family_groups")
    .insert({
      owner_id: user_id,
      max_members,
      plan_tier: "family",
      is_active: true,
    })
    .select()
    .single();

  if (groupError || !group) {
    console.error("Family group creation error:", groupError);
    return NextResponse.json(
      { error: "Failed to create family group" },
      { status: 500 }
    );
  }

  // Add the owner as a family member
  const { data: member, error: memberError } = await supabase
    .from("family_members")
    .insert({
      group_id: group.id,
      user_id,
      role: "owner",
    })
    .select()
    .single();

  if (memberError || !member) {
    console.error("Family member creation error:", memberError);
    // Clean up the group if member insert fails
    await supabase.from("family_groups").delete().eq("id", group.id);
    return NextResponse.json(
      { error: "Failed to add owner as family member" },
      { status: 500 }
    );
  }

  return NextResponse.json({ group });
}

/* ------------------------------------------------------------------ */
/* Invite member to family group                                       */
/* ------------------------------------------------------------------ */

async function handleInvite(body: {
  group_id?: string;
  email?: string;
}) {
  const { group_id, email } = body;

  if (!group_id || !email) {
    return NextResponse.json(
      { error: "group_id and email are required" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Verify group exists and is active
  const { data: group, error: groupError } = await supabase
    .from("family_groups")
    .select("id, max_members, is_active")
    .eq("id", group_id)
    .single();

  if (groupError || !group) {
    return NextResponse.json(
      { error: "Family group not found" },
      { status: 404 }
    );
  }

  if (!group.is_active) {
    return NextResponse.json(
      { error: "Family group is not active" },
      { status: 403 }
    );
  }

  // Check member count
  const { count, error: countError } = await supabase
    .from("family_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", group_id);

  if (countError) {
    console.error("Member count error:", countError);
    return NextResponse.json(
      { error: "Failed to count members" },
      { status: 500 }
    );
  }

  if ((count ?? 0) >= group.max_members) {
    return NextResponse.json(
      { error: "Family group is full" },
      { status: 403 }
    );
  }

  // Look up user by email
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, name")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (userError) {
    console.error("User lookup error:", userError);
    return NextResponse.json(
      { error: "Failed to look up user by email" },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json(
      { error: "No user found with that email" },
      { status: 404 }
    );
  }

  // Check if user is already in any family group
  const { data: existingMembership } = await supabase
    .from("family_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingMembership) {
    return NextResponse.json(
      { error: "User already belongs to a family group" },
      { status: 409 }
    );
  }

  // Add member
  const { data: member, error: memberError } = await supabase
    .from("family_members")
    .insert({
      group_id,
      user_id: user.id,
      role: "member",
    })
    .select()
    .single();

  if (memberError || !member) {
    console.error("Family member invite error:", memberError);
    return NextResponse.json(
      { error: "Failed to add member to family group" },
      { status: 500 }
    );
  }

  return NextResponse.json({ member });
}

/* ------------------------------------------------------------------ */
/* DELETE — remove member from family group                            */
/* ------------------------------------------------------------------ */

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("member_id");
    const groupId = searchParams.get("group_id");

    if (!memberId || !groupId) {
      return NextResponse.json(
        { error: "member_id and group_id are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify the member exists and belongs to the group
    const { data: member, error: memberError } = await supabase
      .from("family_members")
      .select("id, role, user_id")
      .eq("id", memberId)
      .eq("group_id", groupId)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { error: "Member not found in group" },
        { status: 404 }
      );
    }

    // Cannot remove owner
    if (member.role === "owner") {
      return NextResponse.json(
        { error: "Cannot remove the group owner" },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("family_members")
      .delete()
      .eq("id", memberId);

    if (deleteError) {
      console.error("Member removal error:", deleteError);
      return NextResponse.json(
        { error: "Failed to remove member" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Family DELETE error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
