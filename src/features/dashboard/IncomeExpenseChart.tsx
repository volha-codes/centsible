import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useRef } from "react";

import { formatMoney } from "../../lib/money";
import type { Category, CategoryType, MonthTotals } from "../../types";
import { categoryShares, totalsOfType } from "./dashboardUtils";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const fullMonthFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact" });

const DATASET_TYPES: CategoryType[] = ["income", "expense"];
const TOOLTIP_CATEGORIES = 3;

function themeColor(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim();
}

const IncomeExpenseChart = ({
  monthly,
  categories,
  currency,
}: {
  monthly: MonthTotals[];
  categories: Category[];
  currency: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const muted = themeColor("muted");
    const grid = themeColor("border");

    const chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: monthly.map((m) => monthFormat.format(new Date(m.month))),
        datasets: [
          {
            label: "Income",
            data: monthly.map((m) => m.income / 100),
            backgroundColor: themeColor("income"),
            borderRadius: 4,
          },
          {
            label: "Expenses",
            data: monthly.map((m) => m.expense / 100),
            backgroundColor: themeColor("expense"),
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: muted, boxWidth: 12, boxHeight: 12 } },
          tooltip: {
            callbacks: {
              title: ([item]) =>
                fullMonthFormat.format(new Date(monthly[item.dataIndex].month)),
              label: (item) =>
                `${item.dataset.label}: ${formatMoney(
                  Math.round(Number(item.raw) * 100),
                  currency,
                )}`,
              afterLabel: (item) =>
                categoryShares(
                  totalsOfType(
                    monthly[item.dataIndex].categories,
                    categories,
                    DATASET_TYPES[item.datasetIndex],
                  ),
                  categories,
                  TOOLTIP_CATEGORIES,
                ).map((s) => `• ${s.name}: ${formatMoney(s.amount, currency)}`),
            },
          },
        },
        scales: {
          x: { ticks: { color: muted }, grid: { display: false } },
          y: {
            beginAtZero: true,
            ticks: {
              color: muted,
              callback: (value) => compactFormat.format(Number(value)),
            },
            grid: { color: grid },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [monthly, categories, currency]);

  return (
    <div className="relative h-64">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Income and expenses by month, in ${currency}`}
      />
    </div>
  );
};

export default IncomeExpenseChart;
