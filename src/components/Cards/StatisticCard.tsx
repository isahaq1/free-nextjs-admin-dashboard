"use client";
import React from "react";
import dynamic from "next/dynamic";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { motion } from "framer-motion";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface StatisticCardProps {
  today: {
    amount: number;
    change: number;
    isIncrease: boolean;
  };
  yesterday: {
    amount: number;
  };
}

const StatisticCard: React.FC<StatisticCardProps> = ({ today, yesterday }) => {
  const options = {
    chart: {
      type: "radialBar",
      width: 50,
      height: 50,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#FF9F43"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "50%",
        },
        track: {
          margin: 1,
        },
        dataLabels: {
          show: false,
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
  };

  const series = [today.change];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-lg bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                today.isIncrease ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {today.isIncrease ? (
                <FiArrowUp className="h-4 w-4 text-green-600" />
              ) : (
                <FiArrowDown className="h-4 w-4 text-red-600" />
              )}
            </motion.div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base font-semibold"
          >
            BDT {today.amount.toLocaleString()}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-gray-500"
          >
            Yesterday
            <br />
            BDT {yesterday.amount.toLocaleString()}
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="h-[50px] w-[50px]"
        >
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={50}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
