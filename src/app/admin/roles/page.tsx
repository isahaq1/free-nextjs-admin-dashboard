"use client";
import React, { useEffect, useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import axiosInstance from "@/app/api/axiosInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const router = useRouter();
  useEffect(() => {
    // axiosInstance.get("/roles").then((res) => setRoles(res.data));

    axiosInstance.get("/roles").then((res) => {
      setRoles(res.data);
    });
  }, []);

  const fetchMenus = (roleName: string) => {
    try {
      axiosInstance.get(`/roles/${roleName}/menus`).then((res) => {
        const element = document.getElementById("roleDetails");
        if (element) {
          element.innerHTML = roleName; // Assuming the response has a 'content' field
        }
        setMenus(res.data);
      });
    } catch (error: any) {
      if (error.response) {
        if (error.response.status == 403) {
          toast.error(error.response.data.message);
          router.push("/admin/dashboard");
        } else {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl mb-4">Roles</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th className="border p-2">SL</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role: any, index) => (
            <tr key={role.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2"> {role.name}</td>
              <td className="border p-2">
                <button key={role.id} onClick={() => fetchMenus(role.name)}>
                  <FaBookOpen />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl mt-4">
        Assigned Menus of <span id="roleDetails"></span>
      </h2>
      <table className="w-1/4 mt-4 border">
        <tbody>
          {menus.map((menu: any, ind) => (
            <tr key={menu.id}>
              <td className="border p-2">{ind + 1}</td>
              <td className="border p-2">{menu.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;
