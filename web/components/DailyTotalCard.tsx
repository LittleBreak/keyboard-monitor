import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard, Hash, Zap } from "lucide-react";

interface DailyTotalCardProps {
  totalCount: number;
  uniqueKeys: number;
  topCombo: string | null;
  topComboCount: number;
}

export function DailyTotalCards({
  totalCount,
  uniqueKeys,
  topCombo,
  topComboCount,
}: DailyTotalCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Keypresses</CardTitle>
          <Keyboard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {totalCount.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Keys</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{uniqueKeys}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Combo</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCombo ?? "—"}</div>
          {topCombo && (
            <p className="text-xs text-muted-foreground">
              {topComboCount.toLocaleString()} times
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
