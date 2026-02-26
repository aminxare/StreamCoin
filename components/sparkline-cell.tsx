"use client";
import { Sparklines, SparklinesLine } from "react-sparklines";

interface SparklineCellProps {
  data?: number[];
  color?: string;
}

export function SparklineCell({ data, color = "#10b981" }: SparklineCellProps) {
  if (!data || data.length === 0) {
    return <div className="h-8 w-24 bg-muted/30 rounded" />;
  }

  // Optional: color based on overall trend (last vs first price)
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? color : "#ef4444";

  return (
      <Sparklines data={data} margin={5} >
        <SparklinesLine
          color={lineColor}
          style={{ fill: "none", strokeWidth: 1.8 }}
        />
      </Sparklines>
  );
}