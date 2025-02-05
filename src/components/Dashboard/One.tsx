"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  FaUser,
  FaFileAlt,
  FaShoppingCart,
  FaCalculator,
  FaShoppingBag,
  FaFileInvoice,
  FaReceipt,
  FaUsers,
} from "react-icons/fa";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SalesChart from "@/components/Charts/SalesChart";
import DonutChart from "@/components/Charts/DonutChart";
import StatisticsChart from "@/components/Charts/StatisticsChart";
import AttendanceChart from "@/components/Charts/AttendanceChart";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  const quickLinks = [
    {
      title: "Create Customer",
      icon: <FaUser className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Create Quotation",
      icon: <FaFileAlt className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Direct Invoice",
      icon: <FaShoppingCart className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
    {
      title: "POS Orders",
      icon: <FaCalculator className="h-6 w-6" />,
      color: "bg-indigo-500",
    },
    {
      title: "Online Orders",
      icon: <FaShoppingBag className="h-6 w-6" />,
      color: "bg-red-500",
    },
    {
      title: "Create Requisition",
      icon: <FaFileInvoice className="h-6 w-6" />,
      color: "bg-cyan-500",
    },
    {
      title: "Direct Bill",
      icon: <FaReceipt className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Employee Management",
      icon: <FaUsers className="h-6 w-6" />,
      color: "bg-teal-500",
    },
  ];

  const stats = [
    {
      title: "SALES",
      today: { amount: 2365.0, change: 5, up: true },
      thisWeek: { amount: 15420.0, change: -10, up: false },
      thisMonth: { amount: 45365.0, change: 25, up: true },
      thisYear: { amount: 523750.36, change: 100, up: true },
    },
    {
      title: "POS",
      today: { amount: 0.0, change: -100, up: false },
      thisWeek: { amount: 500.0, change: -50, up: false },
      thisMonth: { amount: 1500.0, change: 75, up: true },
      thisYear: { amount: 282045.15, change: 100, up: true },
    },
    {
      title: "PURCHASE",
      today: { amount: 1865.0, change: 95, up: true },
      thisWeek: { amount: 8465.0, change: 22, up: true },
      thisMonth: { amount: 16400.0, change: 45, up: true },
      thisYear: { amount: 256955.73, change: 100, up: true },
    },
  ];

  const receivables = {
    total: 14436809139.42,
    current: 100996.0,
    overdue: 14436708143.42,
  };

  const payables = {
    total: 443565251.28,
    current: 990.0,
    overdue: 443564261.28,
  };

  const salesReturnData = {
    totalPayable: 2611478.89,
    totalApplied: 2176867.12,
    current: { payable: 10000.0, applied: 0.0 },
    previous: { payable: 2601478.89, applied: 2176867.12 },
  };

  const purchaseReturnData = {
    totalReceivable: 7097984.72,
    totalApplied: 2387078.55,
    current: { receivable: 0.0, applied: 0.0 },
    previous: { receivable: 7097984.72, applied: 2387078.55 },
  };

  const itemDetails = {
    lowStock: 419,
    activeItems: 4753,
    itemGroups: 359,
    allItems: 4833,
  };

  const topSellingItems = [
    { name: "Berger Luxury Silk", quantity: 4 },
    { name: "Embroidery", quantity: 10 },
    { name: "Eco Queen", quantity: 7 },
  ];

  const chartData = {
    sales: {
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      color: "#10B981",
    },
    pos: {
      data: [20, 30, 25, 40, 39, 50, 60, 81, 115],
      color: "#6366F1",
    },
    purchase: {
      data: [25, 35, 30, 45, 44, 55, 65, 86, 120],
      color: "#F59E0B",
    },
  };

  const donutData = {
    series: [98, 2],
    labels: ["Active", "Inactive"],
  };

  const attendanceData = {
    present: 60,
    absent: 0,
    late: 0,
    earlyOut: 0,
    weekend: 0,
    holiday: 0,
  };

  return (
    <div className="p-6">
      <div className="mb-4 text-sm text-blue-600">Dashboard</div>

      {/* Quick Links */}
      <div className="mb-8 grid grid-cols-4 gap-4 md:grid-cols-8">
        {quickLinks.map((link, index) => (
          <div
            key={index}
            className={`${link.color} flex h-[90px] cursor-pointer flex-col items-center justify-center rounded-lg p-3 text-white transition-transform hover:scale-105`}
          >
            {link.icon}
            <span className="mt-2 text-center text-xs">{link.title}</span>
          </div>
        ))}
      </div>

      {/* Statistics Sections */}
      {stats.map((stat, index) => (
        <div key={index} className="mb-6 rounded-lg bg-gray-50 p-4">
          <h2 className="mb-4 text-center text-sm font-medium text-gray-700">
            {stat.title}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {Object.entries(stat)
              .filter(([key]) => key !== "title")
              .map(([key, value]) => (
                <div key={key} className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Today</div>
                      <div className="text-sm font-medium text-gray-800">
                        BDT {value.amount.toLocaleString()}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Yesterday
                        <div className="text-sm font-medium text-gray-600">
                          BDT {(value.amount * 0.9).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="relative h-12 w-12">
                      <CircularProgressbar
                        value={value.change}
                        text={`${value.change}%`}
                        styles={{
                          path: { stroke: value.up ? "#10B981" : "#EF4444" },
                          text: {
                            fill: value.up ? "#10B981" : "#EF4444",
                            fontSize: "24px",
                            fontWeight: "bold",
                          },
                          trail: { stroke: "#E5E7EB" },
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Receivables & Payables */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              TOTAL RECEIVABLES
            </h3>
            <button className="text-blue-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-lg font-bold">
            ৳ {receivables.total.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Total Unpaid Invoices
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-3">
              <div className="text-sm text-gray-600">Current</div>
              <div className="text-sm font-medium text-green-600">
                ৳ {receivables.current.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <div className="text-sm text-gray-600">Overdue</div>
              <div className="text-sm font-medium text-red-600">
                ৳ {receivables.overdue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              TOTAL PAYABLES
            </h3>
            <button className="text-blue-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-lg font-bold">
            ৳ {payables.total.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Total Unpaid Invoices
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-green-50 p-3">
              <div className="text-sm text-gray-600">Current</div>
              <div className="text-sm font-medium text-green-600">
                ৳ {payables.current.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <div className="text-sm text-gray-600">Overdue</div>
              <div className="text-sm font-medium text-red-600">
                ৳ {payables.overdue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Items section */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Active Items</h3>
        </div>
        <div className="mt-4 h-[200px]">
          <DonutChart series={donutData.series} labels={donutData.labels} />
        </div>
      </div>

      {/* Item Details & Active Items */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">ITEM DETAILS</h3>
            <button className="text-blue-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="text-xs text-gray-500">Low Stock Items</div>
              <div className="text-lg font-medium text-red-600">
                {itemDetails.lowStock}
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="text-xs text-gray-500">All Active Items</div>
              <div className="text-lg font-medium">
                {itemDetails.activeItems}
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="text-xs text-gray-500">All Item Groups</div>
              <div className="text-lg font-medium">
                {itemDetails.itemGroups}
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="text-xs text-gray-500">All Items</div>
              <div className="text-lg font-medium">{itemDetails.allItems}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Active Items</h3>
            <div className="h-[150px] w-[150px]">
              <CircularProgressbar
                value={98}
                text={`${98}%`}
                styles={{
                  path: { stroke: "#10B981" },
                  text: { fill: "#10B981", fontSize: "16px" },
                  trail: { stroke: "#E5E7EB" },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">
            TOP SELLING ITEMS
          </h3>
          <select className="rounded border-gray-200 text-sm">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          {topSellingItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 rounded-lg bg-white p-3 shadow-sm"
            >
              <div className="h-12 w-12 rounded bg-gray-200"></div>
              <div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.quantity}pc</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HRM Section */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h2 className="mb-4 text-sm font-medium text-gray-700">HRM</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Employee Attendance</h3>
              <input type="date" className="rounded border-gray-200 text-sm" />
            </div>
            <AttendanceChart data={attendanceData} />
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                Dept. Wise Employee Attendance
              </h3>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="rounded border-gray-200 text-sm"
                />
                <select className="rounded border-gray-200 text-sm">
                  <option>Department</option>
                </select>
                <select className="rounded border-gray-200 text-sm">
                  <option>Designation</option>
                </select>
                <select className="rounded border-gray-200 text-sm">
                  <option>Position</option>
                </select>
              </div>
            </div>
            <AttendanceChart data={attendanceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
