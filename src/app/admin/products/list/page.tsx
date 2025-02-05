"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/redux/slices/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useRowSelect,
  Column,
} from "react-table";
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { ProductModal } from "@/components/ProductModal";
import axiosInstance from "@/app/api/axiosInstance";

// Custom checkbox component for row selection
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef: any = (ref ||
      defaultRef) as React.MutableRefObject<HTMLInputElement>;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        className="h-4 w-4 rounded text-blue-600"
        {...rest}
      />
    );
  },
);

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [productId, setproductId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const handleOpenModal = (mode: "add" | "edit", product: any = null) => {
    setModalMode(mode);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitProduct = async (formData: any) => {
    if (modalMode === "add") {
      try {
        // Dispatching the action and awaiting the result

        const result = await dispatch(createProduct(formData));

        // Check if the action was successful
        if (createProduct.fulfilled.match(result)) {
          toast.success("Product added successfully!");
        } else {
          toast.error("Failed to create Model");
        }
      } catch (error) {
        // Handle any errors that might occur during dispatch
        toast.error("Failed to create Model");
      }

      // Handle add product
    } else {
      // Handle edit product

      const result = await dispatch(
        updateProduct({ id: productId, productData: formData }),
      );

      if (updateProduct.fulfilled.match(result)) {
        toast.success("Successfully Updated");
      }
    }
    handleCloseModal();
  };

  const handleEdit = (id: number) => {
    dispatch(getProductDetails(id)).then((resp) => {
      const product = resp.payload;
      setproductId(id);
      handleOpenModal("edit", product);
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this Product?")) {
      const result = dispatch(deleteProduct(id));

      if (deleteProduct.fulfilled.match(result)) {
        toast.success("Successfully Deleted");
      }
    }
  };

  const columns: Column[] = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sortType: "alphanumeric",
      },
      {
        Header: "Details",
        accessor: "details",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }: any) => `$${value.toLocaleString()}`,
        sortType: "number",
      },
      {
        Header: "Category",
        accessor: "category.name",
      },
      {
        Header: "Model",
        accessor: "model.name",
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }: any) => (
          <img
            src={value}
            alt="Product"
            className="h-12 w-12 rounded object-cover"
          />
        ),
        disableSortBy: true,
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
        disableSortBy: true,
      },
    ],
    [],
  );

  const data = React.useMemo(() => products, [products]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    },
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product List</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <button
            onClick={() => handleOpenModal("add")}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <span>Add Product</span>
            <span>+</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.render("Header")}</span>
                      {column.canSort && (
                        <span className="ml-2">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown className="inline" />
                            ) : (
                              <FaSortUp className="inline" />
                            )
                          ) : (
                            <FaSort className="inline" />
                          )}
                        </span>
                      )}
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
                <tr
                  {...row.getRowProps()}
                  className={`
                    hover:bg-gray-50
                    ${row.isSelected ? "bg-blue-50" : ""}
                  `}
                >
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
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {Object.keys(selectedRowIds).length} row(s) selected
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProduct}
        initialData={selectedProduct}
        mode={modalMode}
      />
    </div>
  );
};

export default ProductList;
