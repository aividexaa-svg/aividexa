import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/firebase/admin"; // your admin init

export async function GET() {
  try {
    const session = cookies().get("session")?.value;
    if (!session) {
      return NextResponse.json({ plan: null }, { status: 401 });
    }

    const decoded = await getAuth().verifySessionCookie(session, true);
    const uid = decoded.uid;

    const snap = await adminDb.collection("users").doc(uid).get();
    const data = snap.data();

    return NextResponse.json({
      plan: data?.plan ?? "free",
    });
  } catch (err) {
    console.error("Plan fetch failed", err);
    return NextResponse.json({ plan: null }, { status: 500 });
  }
}
