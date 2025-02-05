"use client";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface StatisticsChartProps {
  data: {
    today: { amount: number; change: number; up: boolean };
    thisWeek: { amount: number; change: number; up: boolean };
    thisMonth: { amount: number; change: number; up: boolean };
    thisYear: { amount: number; change: number; up: boolean };
  };
  type: "SALES" | "POS" | "PURCHASE";
}

const StatisticsChart = ({ data, type }: StatisticsChartProps) => {
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [
      type === "SALES" ? "#10B981" : type === "POS" ? "#6366F1" : "#F59E0B",
    ],
    stroke: {
      width: 2,
      curve: "smooth",
    },
    xaxis: {
      categories: ["Today", "This Week", "This Month", "This Year"],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    tooltip: {
      enabled: true,
      theme: "light",
      y: {
        formatter: (val: number) => `BDT ${val.toLocaleString()}`,
      },
    },
    dataLabels: { enabled: false },
  };

  const series = [
    {
      name: type,
      data: [
        data.today.amount,
        data.thisWeek.amount,
        data.thisMonth.amount,
        data.thisYear.amount,
      ],
    },
  ];

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 flex w-full justify-between">
        <div>
          <div className="text-xs text-gray-500">Today</div>
          <div className="text-sm font-medium">
            BDT {data.today.amount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            Yesterday
            <br />
            BDT {(data.today.amount * 0.9).toLocaleString()}
          </div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            data.today.up ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span
            className={`text-sm font-medium ${
              data.today.up ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.today.change}%
          </span>
        </div>
      </div>
      <div className="mt-16">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={80}
        />
      </div>
    </div>
  );
};

export default StatisticsChart;
