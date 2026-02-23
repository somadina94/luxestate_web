"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

/** Data item for the bar chart: month (x-axis), Rent and Sell (y-axis values) */
export interface BarChartDataItem {
  month: Date;
  Rent: number;
  Sell: number;
}

export interface ChartBarProps {
  /** Chart data with month, Rent, and Sell per item */
  data: BarChartDataItem[];
  /** Optional card title */
  title?: string;
  /** Optional card description */
  description?: string;
  /** Optional className for the card */
  className?: string;
  /** Optional color for Rent series (e.g. "#1864ab") */
  rentColor?: string;
  /** Optional color for Sell series (e.g. "#339af0") */
  sellColor?: string;
}

const defaultChartConfig = {
  month: {
    label: "Month",
  },
  Rent: {
    label: "Rent",
    color: "var(--chart-1)",
  },
  Sell: {
    label: "Sell",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

/** Normalize data so Recharts can use it (month as ISO string for axis/tooltip) */
function toChartData(items: BarChartDataItem[]) {
  return items.map((item) => ({
    ...item,
    month: item.month instanceof Date ? item.month.toISOString() : item.month,
  }));
}

export function ChartBar({
  data,
  title = "Rent vs Sell",
  description: descriptionProp = "Rent and sell by month",
  className,
  rentColor,
  sellColor,
}: ChartBarProps) {
  const [activeChart, setActiveChart] = React.useState<"Rent" | "Sell">("Rent");

  const chartConfig = React.useMemo(
    () => ({
      ...defaultChartConfig,
      Rent: {
        label: "Rent",
        color: rentColor ?? defaultChartConfig.Rent.color,
      },
      Sell: {
        label: "Sell",
        color: sellColor ?? defaultChartConfig.Sell.color,
      },
    }),
    [rentColor, sellColor],
  );

  const chartData = React.useMemo(() => toChartData(data), [data]);

  const total = React.useMemo(
    () => ({
      Rent: data.reduce((acc, curr) => acc + curr.Rent, 0),
      Sell: data.reduce((acc, curr) => acc + curr.Sell, 0),
    }),
    [data],
  );

  if (!data.length) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
          No data to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className ?? "py-0"}>
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{descriptionProp}</CardDescription>
        </div>
        <div className="flex">
          {(["Rent", "Sell"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
