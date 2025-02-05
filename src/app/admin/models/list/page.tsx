"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { listModels, deleteModel } from "@/redux/slices/modelSlice";
import { toast } from "react-toastify";
import { useTable, useFilters, useGlobalFilter, Column } from "react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const ModelList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { models, loading, totalPages, error, pageable } = useSelector(
    (state: RootState) => state.model,
  );

  const currentPage = pageable.pageNumber || 0;

  useEffect(() => {
    dispatch(listModels({ page: currentPage, size: 10 }));
  }, [dispatch, currentPage]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this model?")) {
      dispatch(deleteModel(id))
        .then(() => {
          toast.success("model deleted successfully");
        })
        .catch(() => {
          toast.error("Failed to delete model");
        });
    }
  };

  // Define columns, including a column for serial number
  const columns: Column<any>[] = React.useMemo(
    () => [
      {
        Header: "Serial No",
        accessor: (row: any, index: number) => index + 1, // Adding serial number based on the row index
        Cell: ({ value }: any) => <span>{value}</span>, // Display serial number
      },
      {
        Header: "Name",
        accessor: "name",
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <input
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder="Filter by name"
            className="rounded border px-2 py-1"
          />
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: any) => (value ? "Active" : "Inactive"),
        Filter: ({ column: { filterValue, setFilter } }: any) => (
          <input
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder="Filter by status"
            className="rounded border px-2 py-1"
          />
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }: any) => (
          <div>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="rounded bg-red-500 px-4 py-2 text-white"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const data = React.useMemo(() => models, [models]);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: () => null, // Default to no filter
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    { columns, data, defaultColumn },
    useFilters, // Enables individual column filters
    useGlobalFilter, // Enables global filter
  );

  return (
    <>
      <Breadcrumb pageName="Model List" />
      <div>
        <h2>Model List</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {/* Global Search Filter */}
        <div className="mb-4">
          <input
            value={state.globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            placeholder="Search all columns..."
            className="w-full rounded border px-4 py-2"
          />
        </div>

        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-green-200"
        >
          <thead className="bg-blue-500">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black"
                  >
                    {column.render("Header")}
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="divide-y divide-gray-200 bg-white"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() =>
              dispatch(listModels({ page: currentPage - 1, size: 10 }))
            }
            disabled={currentPage <= 0}
            className={`px-4 py-2 ${
              currentPage <= 0 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <span>{`Page ${currentPage + 1} of ${totalPages}`}</span>
          <button
            onClick={() =>
              dispatch(listModels({ page: currentPage + 1, size: 10 }))
            }
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 ${
              currentPage >= totalPages - 1
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ModelList;
