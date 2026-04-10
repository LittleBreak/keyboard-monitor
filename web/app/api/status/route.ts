import { NextResponse } from "next/server";
import { isDaemonActive } from "@/lib/queries";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    const active = isDaemonActive();
    return NextResponse.json({ active });
  } catch {
    return NextResponse.json({ active: false });
  }
}
