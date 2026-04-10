import { NextRequest, NextResponse } from "next/server";
import { getDailyTotals } from "@/lib/queries";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const to =
    searchParams.get("to") ?? new Date().toISOString().split("T")[0];
  const from =
    searchParams.get("from") ??
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

  try {
    const totals = getDailyTotals(from, to);
    return NextResponse.json({ from, to, totals });
  } catch {
    return NextResponse.json(
      { error: "Failed to query database" },
      { status: 500 }
    );
  }
}
