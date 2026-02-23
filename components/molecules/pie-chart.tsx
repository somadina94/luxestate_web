"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A simple pie chart";

export interface PieChartDataItem {
  item: string;
  value: string;
  color: string;
}

interface ChartPieSimpleProps {
  data: PieChartDataItem[];
  title?: string;
  description?: string;
  footerText?: string;
  trendText?: string;
}

export function ChartPieSimple({
  data,
  title = "Pie Chart",
  description: cardDescription,
  footerText,
  trendText,
}: ChartPieSimpleProps) {
  // Transform data to Recharts format
  const chartData = data.map((item) => ({
    name: item.item,
    value: parseFloat(item.value) || 0,
    fill: item.color,
  }));

  // Generate chartConfig dynamically
  const chartConfig: ChartConfig = {
    value: {
      label: "Value",
    },
    ...data.reduce(
      (acc, item) => {
        // Add normalized key for other uses
        acc[item.item.toLowerCase().replace(/\s+/g, "-")] = {
          label: item.item,
          color: item.color,
        };
        // Add original item name as key for legend lookup
        acc[item.item] = {
          label: item.item,
          color: item.color,
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>,
    ),
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col max-w-120 w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {cardDescription && (
          <CardDescription>{cardDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="value" nameKey="name" label />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {(footerText || trendText) && (
        <CardFooter className="flex-col gap-2 text-sm">
          {trendText && (
            <div className="flex items-center gap-2 leading-none font-medium">
              {trendText} <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footerText && (
            <div className="text-muted-foreground leading-none">
              {footerText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
