"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FaCalendarAlt } from "react-icons/fa";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-02-04",
  });

  // Income By Category Chart Options
  const incomePieOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: ["Sales", "Discount Given"],
    colors: ["#A5D8E6", "#4DB6AC"],
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
        },
      },
    ],
  };

  const incomePieSeries = [40912124.32, 0];

  // Expense Breakdown Chart Options
  const expensePieOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: ["Cost of Goods Sold", "EBL Bank Loan", "Payroll - Salary & Wages"],
    colors: ["#B39DDB", "#90CAF9", "#EF9A9A"],
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
        },
      },
    ],
  };

  const expensePieSeries = [2000000, 463695.98, 100000];

  // Income vs Expenses Column Chart Options
  const columnChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
      background: "transparent",
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        endingShape: "rounded",
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return "৳" + (val / 1000000).toFixed(1) + "M";
      },
      style: {
        fontSize: "12px",
      },
      offsetY: -20,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return "৳" + (value / 1000000).toFixed(1) + "M";
        },
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
      title: {
        text: "Amount in Millions",
        style: {
          fontSize: "12px",
          color: "#64748b",
        },
      },
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val: number) {
          return "৳" + val.toLocaleString();
        },
      },
      theme: "light",
    },
    colors: ["#4CAF50", "#FF5252"], // Green for income, Red for expenses
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
      markers: {
        radius: 4,
      },
      itemMargin: {
        horizontal: 15,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
  };

  const columnChartSeries = [
    {
      name: "Income",
      data: [
        40912124, 38500000, 42000000, 39000000, 41500000, 40000000, 43000000,
        41000000, 39500000, 42500000, 41000000, 40912124,
      ],
    },
    {
      name: "Expenses",
      data: [
        2563695, 2400000, 2800000, 2300000, 2600000, 2500000, 2700000, 2400000,
        2300000, 2900000, 2600000, 2563695,
      ],
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl text-blue-600">Accounting Dashboard</h1>
        <div className="flex items-center gap-2">
          <select className="rounded-md border p-2">
            <option>Custom</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="rounded-md border p-2"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="rounded-md border p-2"
            />
          </div>
          <button className="rounded-md bg-blue-500 px-4 py-2 text-white">
            Apply Filter
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Income Card */}
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-600">Income</h3>
              <p className="text-lg font-bold">৳ 40,912,124.32</p>
              <div className="text-xs text-gray-500">
                <span>Feb, 2025</span>
                <span className="ml-2">৳ 142,021.00</span>
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <span className="text-blue-600">💰</span>
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-600">Expense</h3>
              <p className="text-lg font-bold">৳ 2,563,695.98</p>
              <div className="text-xs text-gray-500">
                <span>Feb, 2025</span>
                <span className="ml-2">৳ 101,306.97</span>
              </div>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <span className="text-red-600">💸</span>
            </div>
          </div>
        </div>

        {/* Similar cards for Profit, Customer Payments, and Supplier Payments */}
      </div>

      {/* Charts Section */}
      <div className="mb-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">
              Income vs Expenses
            </h3>
            <select className="rounded-md border border-gray-200 px-3 py-1 text-sm">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <ReactApexChart
            options={columnChartOptions}
            series={columnChartSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Income By Category */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">Income By Category</h3>
          <ReactApexChart
            options={incomePieOptions}
            series={incomePieSeries}
            type="pie"
            height={350}
          />
        </div>

        {/* Expense Breakdown */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-4 text-lg font-medium">Expense Breakdown</h3>
          <ReactApexChart
            options={expensePieOptions}
            series={expensePieSeries}
            type="pie"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
