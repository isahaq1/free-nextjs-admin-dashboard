"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listLocations,
  getLocationDetails,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/redux/slices/locationSlice";
import { RootState, AppDispatch } from "@/redux/store";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useRowSelect,
  usePagination,
  Column,
} from "react-table";
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Pagination Button Component
const PaginationButton = ({ isDisabled, onClick, children }: any) => (
  <button
    className={`rounded-md border px-3 py-1 text-sm ${
      isDisabled
        ? "cursor-not-allowed bg-gray-200"
        : "bg-blue-500 text-white hover:bg-blue-600"
    }`}
    disabled={isDisabled}
    onClick={onClick}
  >
    {children}
  </button>
);

const LocationList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locations, loading, error } = useSelector(
    (state: RootState) => state.location,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [locationId, setLocationId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(listLocations());
  }, [dispatch]);

  const handleEdit = (id: number) => {
    dispatch(getLocationDetails(id)).then((resp) => {
      const location = resp.payload;
      setLocationId(id);
      setModalMode("edit");
      setSelectedLocation(location);
      setIsModalOpen(true);
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this Location?")) {
      try {
        const result = await dispatch(deleteLocation(id));
        if (deleteLocation.fulfilled.match(result)) {
          toast.success("Location deleted successfully");
          dispatch(listLocations());
        } else {
          toast.error("Failed to delete location");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (modalMode === "add") {
        const result = await dispatch(createLocation(formData));
        if (createLocation.fulfilled.match(result)) {
          toast.success("Location created successfully");
          dispatch(listLocations());
        } else {
          toast.error("Failed to create location");
        }
      } else {
        const result = await dispatch(
          updateLocation({ id: locationId, locationData: formData }),
        );
        if (updateLocation.fulfilled.match(result)) {
          toast.success("Location updated successfully");
          dispatch(listLocations());
        } else {
          toast.error("Failed to update location");
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column[] = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Contact",
        accessor: "contact",
      },
      {
        Header: "locationType",
        accessor: "locationType",
        Cell: ({ value }: { value: number }) => (
          <span
            className={`rounded px-2 py-1 ${
              value >= 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value == 0 ? "Warehouse" : "Store"}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: { value: boolean }) => (
          <span
            className={`rounded px-2 py-1 ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }: any) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="p-2 text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const data = React.useMemo(() => locations || [], [locations]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Default page size
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Location List</h2>
        <button
          onClick={() => {
            setModalMode("add");
            setSelectedLocation(null);
            setIsModalOpen(true);
          }}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white"
        >
          Add Location
        </button>
      </div>

      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full border-collapse border border-gray-200"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border border-gray-200 px-4 py-2 text-left"
                  >
                    <div className="flex items-center space-x-1">
                      {column.render("Header")}
                      {column.canSort && (
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown />
                            ) : (
                              <FaSortUp />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="border px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
        </div>
        <div className="flex space-x-2">
          <PaginationButton
            onClick={() => previousPage()}
            isDisabled={!canPreviousPage}
          >
            Previous
          </PaginationButton>
          <PaginationButton
            onClick={() => nextPage()}
            isDisabled={!canNextPage}
          >
            Next
          </PaginationButton>
        </div>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="rounded-md border px-3 py-2"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Location Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-medium">
                {modalMode === "add" ? "Add New Location" : "Edit Location"}
              </Dialog.Title>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const locationData = {
                  name: formData.get("name") as string,
                  address: formData.get("address") as string,
                  contact: formData.get("contact") as string,
                  locationType: formData.get("locationType"),
                  status: formData.get("status") === "true",
                };
                handleSubmit(locationData);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedLocation?.name || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  defaultValue={selectedLocation?.address || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact No
                </label>
                <input
                  type="text"
                  name="contact"
                  defaultValue={selectedLocation?.contact || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location Type
                </label>
                <select
                  name="locationType"
                  defaultValue={selectedLocation?.locationType || 0}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="0">Warehouse</option>
                  <option value="1">Store</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={selectedLocation?.status?.toString() || "true"}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white ${
                    isSubmitting ? "opacity-50" : "hover:bg-blue-600"
                  }`}
                >
                  {isSubmitting
                    ? "Processing..."
                    : modalMode === "add"
                      ? "Add Location"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default LocationList;
