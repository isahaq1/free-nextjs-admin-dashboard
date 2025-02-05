"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createModel } from "@/redux/slices/modelSlice";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
const CreateModelForm: React.FC = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatching the action and awaiting the result
      const result = await dispatch(createModel({ name }));

      // Check if the action was successful
      if (createModel.fulfilled.match(result)) {
        toast.success("Successfully Created");
        router.push("/admin/models/list"); // Redirect after success
      } else {
        toast.error("Failed to create Model");
      }
    } catch (error) {
      // Handle any errors that might occur during dispatch
      toast.error("Failed to create Model");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Model Create" />
      <div className="max-w-lg rounded-md bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Create Model</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Model Name:
            </label>

            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateModelForm;
