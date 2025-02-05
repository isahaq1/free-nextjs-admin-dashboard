"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchUsersWithPagination,
  deleteUser,
} from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const UserList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading, error, totalPages, pageable } = useSelector(
    (state: RootState) => state.user,
  );
  const currentPage = pageable.pageNumber || 0;
  useEffect(() => {
    dispatch(fetchUsersWithPagination({ page: currentPage, size: 10 }));
  }, [dispatch, currentPage]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(result)) {
        toast.success("Successfully Deleted");
        router.push("/admin/users/list");
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchUsersWithPagination({ page, size: 10 }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="m-0 bg-white p-0">
      <h2 className="mb-4 text-xl font-bold">User List</h2>
      <table className="mt-4 w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Sl.</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Email Verified</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Profile Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="border-t">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">{user.username}</td>
              <td className="border p-2 text-center">{user.email}</td>
              <td className="border p-2 text-center">
                {user.emailVerified ? "Yes" : "No"}
              </td>
              <td className="border p-2 text-center">{user.role.name}</td>
              <td className="border p-2 text-center">
                <Image
                  src={`${apiUrl}/files${user.profileImage}`}
                  width={60}
                  height={50}
                  alt="UserImage"
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  className="mr-2 text-blue-500"
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage + 1 <= 0}
          className={`px-4 py-2 ${
            currentPage + 1 < 1 ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span>{`Page ${currentPage + 1} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 2)}
          disabled={currentPage + 1 >= totalPages}
          className={`px-4 py-2 ${
            currentPage + 1 >= totalPages
              ? "bg-gray-300"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
