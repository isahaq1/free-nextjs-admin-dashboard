"use client";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface AttendanceChartProps {
  data: {
    present: number;
    absent: number;
    late: number;
    earlyOut: number;
    weekend: number;
    holiday: number;
  };
}

const AttendanceChart = ({ data }: AttendanceChartProps) => {
  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    colors: ["#60A5FA"],
    dataLabels: { enabled: false },
    grid: {
      show: true,
      borderColor: "#f1f1f1",
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: [
        "Present",
        "Absent",
        "Late",
        "EarlyOut",
        "Weekend",
        "Holiday",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
    },
  };

  const series = [
    {
      name: "Attendance",
      data: [
        data.present,
        data.absent,
        data.late,
        data.earlyOut,
        data.weekend,
        data.holiday,
      ],
    },
  ];

  return (
    <ReactApexChart options={options} series={series} type="bar" height={300} />
  );
};

export default AttendanceChart;
