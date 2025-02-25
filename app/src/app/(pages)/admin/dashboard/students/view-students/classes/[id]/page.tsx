"use client";
import DynamicBreadcrumb from "@/app/component/DynamicBreadCrumb/DynamicBreadCrumb";
import DynamicTable from "@/app/component/DynamicTable/DynamicTable";
import { useEffect, useState } from "react";
import { parse as csvParse, unparse as csvUnparse } from "papaparse";
import { getStudentsById } from "@/service/teacherService";
import { useParams } from "next/navigation";
import moment from "moment";

const studentData = {
  headers: [
    {
      id: "id",
      displayName: "Student ID",
      hidden: false,
      sortable: true,
      filterable: true,
      visibility: true,
    },
    {
      id: "name",
      displayName: "Full Name",
      hidden: false,
      sortable: true,
      filterable: true,
      visibility: true,
    },
    {
      id: "gender",
      displayName: "Gender",
      hidden: false,
      sortable: true,
      filterable: false,
      visibility: true,
    },
    {
      id: "dateofbirth",
      displayName: "Date of Birth",
      hidden: false,
      sortable: false,
      filterable: false,
      visibility: true,
    },
    {
      id: "mobile",
      displayName: "Mobile Number",
      hidden: false,
      sortable: false,
      filterable: true,
      visibility: true,
    },
    {
      id: "email",
      displayName: "Email",
      hidden: false,
      sortable: false,
      filterable: true,
      visibility: true,
    },
    {
      id: "address",
      displayName: "Address",
      hidden: false,
      sortable: false,
      filterable: true,
      visibility: true,
    },
    {
      id: "bloodGroup",
      displayName: "Blood Group",
      hidden: false,
      sortable: false,
      filterable: false,
      visibility: true,
    },
    {
      id: "gaurdianName",
      displayName: "Guardian Name",
      hidden: false,
      sortable: false,
      filterable: true,
      visibility: true,
    },
    {
      id: "gaurdianMobile",
      displayName: "Guardian Mobile",
      hidden: false,
      sortable: false,
      filterable: true,
      visibility: true,
    },
    {
      id: "govDocs",
      displayName: "Government Documents",
      hidden: false,
      sortable: false,
      filterable: false,
      visibility: true,
    },
    {
      id: "standardId",
      displayName: "Standard ID",
      hidden: false,
      sortable: true,
      filterable: true,
      visibility: true,
    },
    {
      id: "created_at",
      displayName: "Created At",
      hidden: true,
      sortable: true,
      filterable: false,
      visibility: true,
    },
  ],

  pagination: {
    totalRecords: 12,
    pageSize: 5,
    currentPage: 1,
    totalPages: 3,
  },
};

export default function Students() {
  const { id } = useParams();
  const [data, setData] = useState({
    values: [],
    headers: [],
    pagination: { pageSize: 10, total: 0 },
  });

  const [sorting, setSorting] = useState<any>([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const fetchData = async (id: any) => {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        sort: JSON.stringify(sorting),
        filters: JSON.stringify(filters),
      });

      // Fetch data from API
      const { rows, pagination } = await getStudentsById(id);

      if (rows.length < 0) {
        throw new Error("Failed to fetch student data");
      }

      const formattedRows = rows.map((row: any) => ({
        ...row,
        dateofbirth: row.dateofbirth
          ? moment(row.dateofbirth).format("YYYY-MM-DD")
          : "N/A",
      }));

      // Set fetched data in state
      setData({
        headers: studentData.headers,
        values: formattedRows,
        pagination: { pageSize: 10, total: pagination.totalPages || 0 },
      });
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [sorting, filters, currentPage, id]);

  const exportToCSV = () => {
    const visibleHeaders = studentData.headers.filter(
      (header) => header.visibility
    );

    // Create headers for CSV
    const csvHeaders = visibleHeaders.map((header) => header.displayName);

    // Map data for CSV
    const csvData = data?.values.map((row) => {
      const rowData: any = {};
      visibleHeaders.forEach((header) => {
        rowData[header.displayName] = row[header.id];
      });
      return rowData;
    });

    // Convert to CSV
    const csv = csvUnparse({
      fields: csvHeaders,
      data: csvData,
    });

    // Create a blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "student_data.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-3">
      <div className="py-7 flex justify-between items-center">
        <DynamicBreadcrumb
          items={[
            { label: "Home", href: "/admin/dashboard" },
            {
              label: "Students",
              href: "/admin/dashboard/students/view-students/classes",
            },
          ]}
        />
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Export to CSV
        </button>
      </div>
      <div>
        <DynamicTable
          data={data}
          onPageChange={setCurrentPage}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onRowClick={(id) => console.log("Clicked row ID:", id)}
        />
      </div>
    </div>
  );
}
