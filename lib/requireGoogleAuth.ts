import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/admin";

export async function requireGoogleAuth(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = await adminAuth.verifyIdToken(token);

    if (decoded.firebase.sign_in_provider !== "google.com") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    return { user: decoded };
  } catch {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}
