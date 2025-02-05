"use client"
import React, { useState, useEffect } from "react";
import axiosInstance from '@/app/api/axiosInstance'; 
import { toast } from 'react-toastify';

export interface Menu {
    id: number;
    name: string;
    url: string;
    parentId: number | null;
    children: Menu[]; // This will store the child menus
  }

const CreateRole = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
  const [roleName, setRoleName] = useState("");
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);

  useEffect(() => {
    // Fetch available menus
    axiosInstance.get("/menus").then((res) => {
      setMenus(res.data);
     
     
    });
  }, []);

  const handleMenuSelect = (menuId: number) => {
    setSelectedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const handleSubmit = () => {
 
    axiosInstance.post("/roles", { name: roleName, menuIds: selectedMenus }) .then((response) => {
        toast.success("Role created successfully");
      })
      .catch((error) => {
        console.error('Error creating menu:', error);
      });
  };

  return (
    <form className='bg-white'>
        <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Create Role</h1>

       <input
        type="text"
        placeholder="Role Name"
        className="border p-2 w-full mb-4"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
      />

       <h2 className="text-xl mb-2 font-bold">Assign Permission</h2>
      {menus.length === 0 ? (
        <p>No menus available.</p>
      ) : (
        menus.map((module) => (
          <div key={module.id}>
            <h2 className="text-xl font-bold  mb-2">{module.name}</h2>
      
              {module.children.map((childMenu) => (

                    <div key={childMenu.id}>
      
                     <label htmlFor={String(childMenu.id)} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                               <input
                                     type="checkbox" id={String(childMenu.id)}  className="w-4 h-4  text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500  dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                     value={childMenu.id}
                                     onChange={() => handleMenuSelect(childMenu.id)}
                                     checked={selectedMenus.includes(childMenu.id)}
                                   />
                                  {childMenu.name}
                                 </label>
                               </div>
              ))}
           
          </div>
        ))
      )}
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 mt-4">
         Create Role
       </button>
      </div>
    </form>

  );
};

export default CreateRole;
