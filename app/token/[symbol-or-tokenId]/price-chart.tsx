"use client";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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
} from "@/components/ui/chart";
import useSWR from "swr";
import { CryptoTokenInfoTool } from "@/lib/crypto-token-info-tool";

interface TokenPriceChartProps {
  tokenId: string;
  name: string;
}

export function TokenPriceChart({ tokenId, name }: TokenPriceChartProps) {
  const cryptoTokenInfoTool = new CryptoTokenInfoTool();

  const { data: priceData } = useSWR(
    tokenId,
    cryptoTokenInfoTool.getTokenPriceHistory,
    {
      suspense: true,
      fallbackData: [],
    }
  );

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{name} Price Chart (Last 30 Days)</CardTitle>
        <CardDescription>Price in USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            price: {
              label: "Price (USD)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(timestamp) => {
                  return new Date(timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: string) => [
                  `$${Number(value).toLocaleString()}`,
                  "Price",
                ]}
                labelFormatter={(timestamp) =>
                  new Date(timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                name="Price"
                animationDuration={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
