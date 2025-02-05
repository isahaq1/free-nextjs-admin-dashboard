// /app/users/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPurchaseDetails } from "@/redux/slices/purchaseSlice";
import { toast } from "react-toastify";

export default function PurchaseDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { purchaseDetails, loading, error } = useSelector(
    (state: RootState) => state.purchase,
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchPurchaseDetails(Number(id)));
    };

    fetchData();
  }, [dispatch, id]);

  return (
    <div className="max-w-8xl mx-auto border bg-white p-8 shadow-md">
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold uppercase">Purchase Order</h1>
      </header>

      {/* Summary Section */}
      <div className="mb-8 border-b border-t py-4">
        <div className="grid grid-cols-3 gap-4 text-gray-700">
          <div className="flex">
            <span className="font-semibold">Vendor Name:</span>
            <span>{purchaseDetails?.vendor?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold">Warehouse:</span>
            <span>{purchaseDetails?.location?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold">Date:</span>
            <span>{purchaseDetails?.purchaseDate}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="mb-8 w-full border-collapse border text-sm text-gray-700">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Rate</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">VAT</th>
            <th className="border px-4 py-2">Tax</th>
            <th className="border px-4 py-2">Discount</th>
            <th className="border px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {purchaseDetails?.purchaseDetails?.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{item.product?.name}</td>
              <td className="border px-4 py-2">${item.rate}</td>
              <td className="border px-4 py-2">{item.qty}</td>
              <td className="border px-4 py-2">${item.vat}</td>
              <td className="border px-4 py-2">${item.tax}</td>
              <td className="border px-4 py-2">${item.discount}</td>
              <td className="border px-4 py-2 text-end">${item.total}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th className="border px-4 py-2 text-end" colSpan={6}>
              Total Amount
            </th>
            <th className="border px-4 py-2 text-end">
              {purchaseDetails?.totalAmount}
            </th>
          </tr>
          <tr>
            <th className="border px-4 py-2 text-end" colSpan={6}>
              Total Vat
            </th>
            <th className="border px-4 py-2 text-end">
              {purchaseDetails?.totalVat}
            </th>
          </tr>
          <tr>
            <th className="border px-4 py-2 text-end" colSpan={6}>
              Total Tax
            </th>
            <th className="border px-4 py-2 text-end">
              {purchaseDetails?.totalTax}
            </th>
          </tr>
          <tr>
            <th className="border px-4 py-2 text-end" colSpan={6}>
              Total Discount
            </th>
            <th className="border px-4 py-2 text-end">
              {purchaseDetails?.totalDiscount}
            </th>
          </tr>
        </tfoot>
      </table>

      {/* Footer Section */}
      <footer className="text-center text-gray-500">
        <p>Thank you for your business!</p>
        <p className="mt-2 text-xs">
          This is a system-generated document and does not require a signature.
        </p>
      </footer>
    </div>
  );
}
