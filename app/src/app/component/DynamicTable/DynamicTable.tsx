import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_PaginationState, MRT_SortingState } from "material-react-table";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

interface Props {
  data: any;
  onRowClick?: (id: string | number) => void;
  onPageChange: (page: number) => void;
  onSortingChange: (sorting: any) => void;
  onFilterChange: (filters: any) => void;
}

export default function DynamicTable({
  data,
  onRowClick,
  onPageChange,
  onSortingChange,
  onFilterChange,
}: Props) {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: data.pagination?.pageSize || 5,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setLoading(false);
      setTableData(data.values);

      const newColumns = data.headers
        ?.filter((header) => !header.hidden)
        .map((header) => ({
          header: header.displayName,
          accessorKey: header.id,
          enableSorting: header.sortable,
          enableFiltering: header.filterable,
          visibility: header.visibility ?? true,
          Cell: (props) => {
            let value = props.row.original[header.id];
            if (typeof value === "number") {
              value = value.toFixed(2);
            }
            return (
              <span
                className={`tracking-wide ${
                  header.id === "name"
                    ? "font-bold text-gray-600"
                    : " text-gray-500 font-semibold"
                }`}
              >
                {value}
              </span>
            );
          },
        }));

      setColumns(newColumns || []);
      const initialVisibility = newColumns?.reduce((acc, col) => {
        acc[col.accessorKey] = col.visibility ?? true;
        return acc;
      }, {});

      setColumnVisibility(initialVisibility || {});
    }
  }, [data]);

  return (
    <div className="w-full overflow-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          <Loading />
        </div>
      ) : tableData.length > 0 ? (
        <MaterialReactTable
          columns={columns}
          data={tableData}
          // manualFiltering
          // manualSorting
          enableSorting
          enableGlobalFilter
          manualPagination
          state={{ columnVisibility, pagination, sorting }}
          // onGlobalFilterChange={(filter) => onFilterChange(filter)}
          // onColumnFiltersChange={(filters) => onFilterChange(filters)}
          // onSortingChange={(newSorting) => {
          //   console.log(newSorting);
          //   setSorting(newSorting);
          //   onSortingChange(newSorting);
          // }}
          onPaginationChange={(updater) => {
            setPagination((prev) => {
              const newState =
                typeof updater === "function" ? updater(prev) : updater;
              onPageChange(newState.pageIndex + 1);
              return newState;
            });
          }}
          onColumnVisibilityChange={setColumnVisibility}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => {
              if (onRowClick) {
                onRowClick(row?.original?.id);
              }
            },
            sx: {
              cursor: "pointer",
              color: "#f3f4f6",
            },
          })}
          muiTableHeadCellProps={{
            sx: {
              color: "#4b5563",
            },
          }}
        />
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}
