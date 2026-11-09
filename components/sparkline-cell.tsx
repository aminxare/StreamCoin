"use client";
import { Sparklines, SparklinesLine } from "react-sparklines";

interface SparklineCellProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function SparklineCell({
  data,
  color = "#10b981",
  width,
  height,
}: SparklineCellProps) {
  if (!data || data.length === 0) {
    return <div className="h-8 w-24 bg-muted/30 rounded" />;
  }

  // Color based on overall trend (last vs first price)
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? color : "#ef4444";

  return (
    <Sparklines data={data} width={width} height={height} margin={5}>
      <SparklinesLine
        color={lineColor}
        style={{ fill: "none", strokeWidth: 1.8 }}
      />
    </Sparklines>
  );
}