import { NextRequest, NextResponse } from "next/server";
import { getComboCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date =
    searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const search = searchParams.get("search") ?? undefined;

  try {
    const combos = getComboCounts(date, search);
    return NextResponse.json({ date, combos });
  } catch {
    return NextResponse.json(
      { error: "Failed to query database" },
      { status: 500 }
    );
  }
}
