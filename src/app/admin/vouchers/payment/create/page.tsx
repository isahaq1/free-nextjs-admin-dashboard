"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createVoucher } from "@/redux/slices/voucherSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface VoucherDetail {
  accCoaId: number;
  accCostCenterId: number;
  creditAmountBk: number;
  debitAmountBk: number;
  masterRef: string;
  refAccCoaId: number;
  ledgerText: string;
  lineText: string;
  accFlexId: number;
  accProfitCenterId: number;
  bpId: number;
  bpCode: string;
  ccCode: string;
  glCode: string;
  orderNo: string;
  pcCode: string;
  spGlCode: string;
  debitAmount: number;
  creditAmount: number;
}

const CreatePaymentVoucher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.voucher);

  const [voucherData, setVoucherData] = useState({
    type: "PAYMENT",
    voucherNo: "",
    voucherDate: new Date().toISOString().split("T")[0],
    chequeDate: new Date().toISOString().split("T")[0],
    chequeNo: "",
    narration: "",
    voucherStatus: 1,
    totalAmount: 0,
    createById: 1, // Replace with actual user ID
    companyId: 1, // Replace with actual company ID
    companyCode: "COMP001",
    amount: 0,
    description: "",
    vendorId: 0,
  });

  const [voucherDetails, setVoucherDetails] = useState<VoucherDetail[]>([
    {
      accCoaId: 0,
      accCostCenterId: 0,
      creditAmountBk: 0,
      debitAmountBk: 0,
      masterRef: "",
      refAccCoaId: 0,
      ledgerText: "",
      lineText: "",
      accFlexId: 1,
      accProfitCenterId: 0,
      bpId: 0,
      bpCode: "",
      ccCode: "",
      glCode: "",
      orderNo: "",
      pcCode: "",
      spGlCode: "",
      debitAmount: 0,
      creditAmount: 0,
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setVoucherData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailChange = (
    index: number,
    field: keyof VoucherDetail,
    value: any,
  ) => {
    setVoucherDetails((prev) => {
      const newDetails = [...prev];
      newDetails[index] = {
        ...newDetails[index],
        [field]: value,
      };
      return newDetails;
    });
  };

  const addVoucherDetail = () => {
    setVoucherDetails((prev) => [
      ...prev,
      {
        accCoaId: 0,
        accCostCenterId: 0,
        creditAmountBk: 0,
        debitAmountBk: 0,
        masterRef: "",
        refAccCoaId: 0,
        ledgerText: "",
        lineText: "",
        accFlexId: 1,
        accProfitCenterId: 0,
        bpId: 0,
        bpCode: "",
        ccCode: "",
        glCode: "",
        orderNo: "",
        pcCode: "",
        spGlCode: "",
        debitAmount: 0,
        creditAmount: 0,
      },
    ]);
  };

  const removeVoucherDetail = (index: number) => {
    setVoucherDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const voucherPayload = {
        ...voucherData,
        voucherDetails,
      };

      const result = await dispatch(createVoucher(voucherPayload));

      if (createVoucher.fulfilled.match(result)) {
        toast.success("Payment voucher created successfully");
        router.push("/admin/vouchers/payment/list");
      } else {
        toast.error("Failed to create payment voucher");
      }
    } catch (error) {
      toast.error("An error occurred while creating the voucher");
    }
  };

  if (error) {
    toast.error(error);
  }

  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">Create Payment Voucher</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Voucher No
            </label>
            <input
              type="text"
              name="voucherNo"
              value={voucherData.voucherNo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Voucher Date
            </label>
            <input
              type="date"
              name="voucherDate"
              value={voucherData.voucherDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cheque No
            </label>
            <input
              type="text"
              name="chequeNo"
              value={voucherData.chequeNo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cheque Date
            </label>
            <input
              type="date"
              name="chequeDate"
              value={voucherData.chequeDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Narration
          </label>
          <textarea
            name="narration"
            value={voucherData.narration}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium">Voucher Details</h3>
          {voucherDetails.map((detail, index) => (
            <div key={index} className="mb-4 rounded border p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account
                  </label>
                  <input
                    type="number"
                    value={detail.accCoaId}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        "accCoaId",
                        parseInt(e.target.value),
                      )
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Debit Amount
                  </label>
                  <input
                    type="number"
                    value={detail.debitAmount}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        "debitAmount",
                        parseFloat(e.target.value),
                      )
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Credit Amount
                  </label>
                  <input
                    type="number"
                    value={detail.creditAmount}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        "creditAmount",
                        parseFloat(e.target.value),
                      )
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeVoucherDetail(index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addVoucherDetail}
            className="mt-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Add Detail
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Voucher"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePaymentVoucher;
