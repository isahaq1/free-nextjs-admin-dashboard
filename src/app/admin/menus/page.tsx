"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/app/api/axiosInstance";

export interface Menu {
  id: number;
  name: string;
  url: string;
  parentId: number | null;
  children: Menu[]; // This will store the child menus
}

const MenuList = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch menus from the Spring Boot API
    axiosInstance
      .get("/menus")
      .then((response) => {
        setMenus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  // Render the menus hierarchically
  return (
    <div className="mx-auto p-4 bg-white grid grid-cols-4 gap-4">
      {menus.length === 0 ? (
        <p>No Permission available.</p>
      ) : (
        menus.map((module) => (
          <div key={module.id}>
            <h2 className="text-xl font-bold underline">{module.name}</h2>
            <ul className="pl-4">
              {module.children.map((childMenu, ind) => (
                <li key={childMenu.id}>
                  {ind + 1}. {childMenu.name}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MenuList;
