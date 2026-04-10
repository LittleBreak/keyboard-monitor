"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComboKeyCap } from "@/components/KeyCap";
import { Search } from "lucide-react";
import type { ComboCount } from "@/lib/types";

interface ComboListProps {
  data: ComboCount[];
}

export function ComboList({ data }: ComboListProps) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? data.filter((c) => c.combo.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Combo Keys</CardTitle>
          <div className="relative w-48">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter combos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            {data.length === 0 ? "No combo keys yet" : "No matches"}
          </div>
        ) : (
          <div className="max-h-[350px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Combo</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((combo) => (
                  <TableRow key={combo.combo}>
                    <TableCell>
                      <ComboKeyCap combo={combo.combo} />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {combo.count.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
