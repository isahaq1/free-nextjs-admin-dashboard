"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { listProducts } from "@/redux/slices/productSlice";
import { listVendors } from "@/redux/slices/vendorSlice";
import { createPurchase } from "@/redux/slices/purchaseSlice";
import { listWarehouses } from "@/redux/slices/locationSlice";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Select from "react-select";
import { useRouter } from "next/navigation";

interface PurchaseDetail {
  productId: number;
  rate: number;
  qty: number;
  vat: number;
  tax: number;
  discount: number;
  total: number;
}

interface PurchaseFormData {
  purchaseDate: string;
  vendorId: number;
  warehouseId: number;
  purchaseDetails: PurchaseDetail[];
  totalAmount: number;
  totalVat: number;
  totalTax: number;
  totalDiscount: number;
  createdBy: string;
  updatedBy: string;
}

const PurchaseForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const storedAuthUser = localStorage.getItem("authUser");
  let authusername = "";
  if (storedAuthUser) {
    const authUser = JSON.parse(storedAuthUser);
    authusername = authUser.username;
  }
  const [formData, setFormData] = useState<PurchaseFormData>({
    purchaseDate: "",
    vendorId: 0,
    warehouseId: 0,
    purchaseDetails: [
      {
        productId: 0,
        rate: 0,
        qty: 0,
        vat: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
    ],
    totalAmount: 0,
    totalVat: 0,
    totalTax: 0,
    totalDiscount: 0,
    createdBy: authusername,
    updatedBy: "",
  });

  const { products } = useSelector((state: RootState) => state.product);
  const { vendors } = useSelector((state: RootState) => state.vendor);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(listProducts());
        dispatch(listVendors());

        const response = await dispatch(listWarehouses());
        if (listWarehouses.fulfilled.match(response)) {
          if (!response.payload) {
            setWarehouses([]);
          }
          setWarehouses(response.payload);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleDetailChange = (index: number, field: string, value: number) => {
    const newDetails = [...formData.purchaseDetails];
    newDetails[index][field] = value;

    // Auto-calculate total for each detail row
    newDetails[index].total =
      (newDetails[index].rate * newDetails[index].qty || 0) +
      (newDetails[index].vat || 0) +
      (newDetails[index].tax || 0) -
      (newDetails[index].discount || 0);

    const totalAmount = newDetails.reduce(
      (sum, detail) => sum + detail.total,
      0,
    );

    const totalVat = newDetails.reduce((sum, detail) => sum + detail.vat, 0);
    const totalTax = newDetails.reduce((sum, detail) => sum + detail.tax, 0);
    const totalDiscount = newDetails.reduce(
      (sum, detail) => sum + detail.discount,
      0,
    );
    setFormData({
      ...formData,
      purchaseDetails: newDetails,
      totalAmount,
      totalVat,
      totalTax,
      totalDiscount,
    });
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      purchaseDetails: [
        ...formData.purchaseDetails,
        {
          productId: 0,
          rate: 0,
          qty: 0,
          vat: 0,
          tax: 0,
          discount: 0,
          total: 0,
        },
      ],
    });
  };

  const deleteDetail = (index: number) => {
    const newDetails = formData.purchaseDetails.filter((_, i) => i !== index);

    // Calculate the total amounts for the form
    const totalAmount = newDetails.reduce(
      (sum, detail) => sum + detail.total,
      0,
    );
    const totalVat = newDetails.reduce((sum, detail) => sum + detail.vat, 0);
    const totalTax = newDetails.reduce((sum, detail) => sum + detail.tax, 0);
    const totalDiscount = newDetails.reduce(
      (sum, detail) => sum + detail.discount,
      0,
    );

    setFormData({
      ...formData,
      purchaseDetails: newDetails,
      totalAmount,
      totalVat,
      totalTax,
      totalDiscount,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const result = await dispatch(createPurchase(formData));

      // Check if the action was successful
      if (createPurchase.fulfilled.match(result)) {
        toast.success("Purchase Saved successfully!");
        router.push(`/admin/purchases/details/${result?.payload?.id}`);
      } else {
        toast.error("Failed to create Purchase");
      }
    } catch (error) {
      // Handle any errors that might occur during dispatch
      toast.error("Failed to create Purchase");
    }
  };

  const vendorOptions = vendors.map((vendor) => ({
    value: vendor.id,
    label: vendor.name,
  }));

  const warehouseOptions = warehouses.map((warehouse) => ({
    value: warehouse.id,
    label: warehouse.name,
  }));

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Create Purchase</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-md bg-white p-6 shadow-md"
      >
        {/* General Purchase Details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({ ...formData, purchaseDate: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vendor
            </label>
            <Select
              options={vendorOptions}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  vendorId: Number(selectedOption?.value) || 0,
                })
              }
              className="mt-1"
              classNamePrefix="react-select"
              isClearable
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Warehouse
            </label>
            <Select
              options={warehouseOptions}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  warehouseId: Number(selectedOption?.value) || 0,
                })
              }
              className="mt-1"
              classNamePrefix="react-select"
              isClearable
            />
          </div>
        </div>

        {/* Purchase Details Table */}
        <div>
          <div className="flex justify-between">
            <div>
              <h2 className=" text-xl font-semibold text-gray-800">
                Purchase Details
              </h2>
            </div>
            <div className="mb-2 text-end">
              {" "}
              <button
                type="button"
                onClick={addDetail}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Add Product
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Rate
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    VAT
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Tax
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Discount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.purchaseDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <select
                        value={detail.productId}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "productId",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                      >
                        <option value={0}>Select a Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={detail.rate}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "rate",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded border border-gray-300 p-2 text-end focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={detail.qty}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "qty",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded border border-gray-300 p-2 text-end focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={detail.vat}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "vat",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded border border-gray-300 p-2 text-end focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={detail.tax}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "tax",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded border border-gray-300 p-2 text-end focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={detail.discount}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "discount",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded border border-gray-300 p-2 text-end focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={detail.total}
                        readOnly
                        className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-end text-gray-700"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        type="button"
                        onClick={() => deleteDetail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mr-4">
          <div className="flex justify-end">
            <label className="mr-2 block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="number"
              value={formData.totalAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalAmount: parseFloat(e.target.value),
                })
              }
              className="mt-1 rounded border-[1.5px] border-stroke  bg-gray-100  px-0 py-1 text-end text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
              readOnly
            />
          </div>
          <div className="mt-2 flex justify-end">
            <label className="mr-2 block text-sm font-medium text-gray-700">
              Total VAT
            </label>
            <input
              type="number"
              value={formData.totalVat}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalVat: parseFloat(e.target.value),
                })
              }
              className="mt-1rounded border-[1.5px] border-stroke  bg-gray-100  px-0 py-1 text-end text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>
          <div className="mt-2 flex justify-end">
            <label className="mr-2 block text-sm font-medium text-gray-700">
              Total Tax
            </label>
            <input
              type="number"
              value={formData.totalTax}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalTax: parseFloat(e.target.value),
                })
              }
              className="mt-1 rounded border-[1.5px] border-stroke bg-gray-100 px-0 py-1 text-end text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>
          <div className="mt-2 flex justify-end">
            <label className="mr-2 block text-sm font-medium text-gray-700">
              Total Discount
            </label>
            <input
              type="number"
              value={formData.totalDiscount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalDiscount: parseFloat(e.target.value),
                })
              }
              className="mt-1rounded border-[1.5px] border-stroke bg-gray-100  px-0 py-1 text-end text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-green-500 px-6 py-3 text-white hover:bg-green-600"
          >
            Submit Purchase
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;
