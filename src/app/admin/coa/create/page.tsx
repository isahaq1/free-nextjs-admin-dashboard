"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCoas, createCoa } from "@/redux/slices/coaSlice";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

interface Coa {
  coaName: string;
  coaType: string;
  isGroupHead: number;
  keyWord: string;
  parentId: number;
  sortBy: number;
  groupName: string;
  groupCode: string;
  companyCode: string;
  isSpecialGl: number;
  gcBk: string;
}

const CreateCoaPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coas, loading, error } = useSelector((state: RootState) => state.coa);
  const router = useRouter();
  const [coa, setCoa] = useState<Coa>({
    coaName: "",
    coaType: "",
    isGroupHead: 0,
    keyWord: "",
    parentId: 0,
    sortBy: 0,
    groupName: "",
    groupCode: "",
    companyCode: "",
    isSpecialGl: 0,
    gcBk: "",
  });

  useEffect(() => {
    dispatch(fetchCoas());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCoa({
      ...coa,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatching the action and awaiting the result
      const result = await dispatch(createCoa(coa));

      // Check if the action was successful
      if (createCoa.fulfilled.match(result)) {
        toast.success("Successfully Created");
        router.push("/admin/coa"); // Redirect after success
      } else {
        toast.error("Failed to create coa");
      }
    } catch (error) {
      // Handle any errors that might occur during dispatch
      toast.error("Failed to create coa");
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Create COA</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            COA Name
          </label>
          <input
            name="coaName"
            value={coa.coaName}
            onChange={handleChange}
            placeholder="COA Name"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            COA Type
          </label>
          <select
            name="coaType"
            value={coa.coaType}
            onChange={handleChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select COA Type</option>
            <option value="Asset">Asset</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
            <option value="Liability">Liability</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Is Group Head
          </label>
          <input
            name="isGroupHead"
            type="number"
            value={coa.isGroupHead}
            onChange={handleChange}
            placeholder="Is Group Head"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key Word
          </label>
          <input
            name="keyWord"
            value={coa.keyWord}
            onChange={handleChange}
            placeholder="Key Word"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parent ID
          </label>
          <select
            name="parentId"
            value={coa.parentId}
            onChange={handleChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value={0}>Select Parent</option>
            {coas.map((coa) => (
              <option key={coa.id} value={coa.id}>
                {coa.coaName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <input
            name="sortBy"
            type="number"
            value={coa.sortBy}
            onChange={handleChange}
            placeholder="Sort By"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Group Name
          </label>
          <input
            name="groupName"
            value={coa.groupName}
            onChange={handleChange}
            placeholder="Group Name"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Group Code
          </label>
          <input
            name="groupCode"
            value={coa.groupCode}
            onChange={handleChange}
            placeholder="Group Code"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Code
          </label>
          <input
            name="companyCode"
            value={coa.companyCode}
            onChange={handleChange}
            placeholder="Company Code"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Is Special GL
          </label>
          <input
            name="isSpecialGl"
            type="number"
            value={coa.isSpecialGl}
            onChange={handleChange}
            placeholder="Is Special GL"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GC BK
          </label>
          <input
            name="gcBk"
            value={coa.gcBk}
            onChange={handleChange}
            placeholder="GC BK"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoaPage;
