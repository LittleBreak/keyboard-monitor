import { NextRequest, NextResponse } from "next/server";
import {
  getDailyTotal,
  getUniqueKeysCount,
  getTopCombo,
  getKeyCounts,
  getComboCounts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date =
    searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  try {
    const totalCount = getDailyTotal(date);
    const uniqueKeys = getUniqueKeysCount(date);
    const topComboResult = getTopCombo(date);
    const keys = getKeyCounts(date);
    const combos = getComboCounts(date);

    return NextResponse.json({
      date,
      totalCount,
      uniqueKeys,
      topCombo: topComboResult?.combo ?? null,
      topComboCount: topComboResult?.count ?? 0,
      keys,
      combos,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to query database" },
      { status: 500 }
    );
  }
}
