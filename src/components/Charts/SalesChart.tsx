"use client";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SalesChartProps {
  data: number[];
  color: string;
  type: string;
}

const SalesChart = ({ data, color, type }: SalesChartProps) => {
  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
      },
    },
    colors: [color],
    tooltip: {
      theme: "light",
      x: { show: false },
      y: {
        formatter: (val: number) => `BDT ${val.toLocaleString()}`,
      },
    },
    dataLabels: { enabled: false },
  };

  const series = [{ name: type, data }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={100}
    />
  );
};

export default SalesChart;
