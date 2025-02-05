import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();
  const userRoles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = localStorage.getItem("isAdmin");
  const userPermissions = userRoles
    ? userRoles.menus.map((menu: any) => menu.url)
    : [];

  const filteredSubMenu = item?.filter((subItem: any) => {
    if (isAdmin == "true") {
      return true; // Admin can see all submenu items
    }
    return userPermissions.includes(subItem.permission); // Regular user can see items they have permission for
  });

  return (
    <>
      {isAdmin == "true" ? (
        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
          {item.map((item: any, index: number) => (
            <li key={index}>
              <Link
                href={item.route}
                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                  pathname === item.route ? "text-white" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
          {item
            .filter((subItem: any) =>
              userPermissions.includes(subItem.permission),
            )
            .map((item: any, index: number) => (
              <li key={index}>
                <Link
                  href={item.route}
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                    pathname === item.route ? "text-white" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </>
  );
};

export default SidebarDropdown;
