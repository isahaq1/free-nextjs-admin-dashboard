"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/app/api/axiosInstance";

interface Menu {
  id: number;
  name: string;
}

const MenuForm: React.FC = () => {
  const [menuName, setMenuName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [parentMenus, setParentMenus] = useState<Menu[]>([]);

  useEffect(() => {
    // Fetch parent menus from the backend
    axiosInstance
      .get("/menus/parents")
      .then((response) => {
        setParentMenus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parent menus:", error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create the menu data to submit
    const menuData = {
      name: menuName,
      url: url,
      parentId: parentId,
    };

    // Make the API request to save the menu
    axiosInstance
      .post("/menus", menuData)
      .then((response) => {
        // console.log('Menu created successfully', response.data);
        toast.success("Permission created successfully");
      })
      .catch((error) => {
        console.error("Error creating menu:", error);
      });
  };

  return (
    <div className=" max-w-lg rounded-md bg-white p-4 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold">Create Permission</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="menuName"
            className="block text-sm font-medium text-gray-700"
          >
            Permission Label
          </label>
          <input
            type="text"
            autoComplete="off"
            id="menuName"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            required
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Permission
          </label>
          <input
            type="text"
            autoComplete="off"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="parentId"
            className="block text-sm font-medium text-gray-700"
          >
            Parent Permission Directory
          </label>
          <select
            id="parentId"
            value={parentId || ""}
            onChange={(e) => setParentId(Number(e.target.value) || null)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select Parent Directory</option>
            {parentMenus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MenuForm;
