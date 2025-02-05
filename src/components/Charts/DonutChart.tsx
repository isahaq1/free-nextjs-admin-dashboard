"use client";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DonutChartProps {
  series: number[];
  labels: string[];
}

const DonutChart = ({ series, labels }: DonutChartProps) => {
  const options = {
    chart: {
      type: "donut",
    },
    colors: ["#10B981", "#E5E7EB"],
    labels,
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Active",
              formatter: () => "98%",
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={200}
    />
  );
};

export default DonutChart;
