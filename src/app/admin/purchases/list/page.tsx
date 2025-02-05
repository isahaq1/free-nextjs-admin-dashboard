"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { listPurchases } from "@/redux/slices/purchaseSlice";
import { FaEye, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PurchaseListPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { purchases, loading, totalPages, error, pageSize, currentPage } =
    useSelector((state: RootState) => state.purchase);

  useEffect(() => {
    dispatch(listPurchases({ page: currentPage, size: 10 }));
  }, [dispatch]);

  return (
    <div className="bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Purchase List</h2>
        <button
          onClick={() => {
            router.push(`/admin/purchases/create/`);
          }}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white"
        >
          Add Purchase
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">Sl</th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                <div className="flex items-center space-x-1 ">
                  {" "}
                  Purchase Date
                </div>
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Total Amount
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Vendor
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Total VAT
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Total Tax
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Total Discount
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Created By
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Updated By
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase: any, index) => (
              <tr key={purchase.id}>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {index + 1}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.purchaseDate}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.totalAmount}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.vendor.name}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.totalVAT}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.totalTax}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.totalDiscount}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.createdBy}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  {purchase.updatedBy}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-left">
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() =>
                      router.push(`/admin/purchases/details/${purchase.id}`)
                    }
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() =>
              dispatch(listPurchases({ page: currentPage - 1, size: 10 }))
            }
            disabled={currentPage <= 0}
            className={`rounded-md border px-3 py-1 text-sm ${
              currentPage <= 0 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <span>{`Page ${currentPage + 1} of ${totalPages}`}</span>
          <button
            onClick={() =>
              dispatch(listPurchases({ page: currentPage + 1, size: 10 }))
            }
            disabled={currentPage >= totalPages - 1}
            className={`rounded-md border px-3 py-1 text-sm ${
              currentPage >= totalPages - 1
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseListPage;
