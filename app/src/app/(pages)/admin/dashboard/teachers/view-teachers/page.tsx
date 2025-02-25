"use client";

import { useEffect, useState } from "react";
import { getAllTeachers } from "@/service/teacherService";
import { getClassIds } from "@/service/class";
import DynamicTable from "@/app/component/DynamicTable/DynamicTable";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classData, setClassData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersData, classes] = await Promise.all([
          getAllTeachers(),
          getClassIds(),
        ]);

        setTeachers(teachersData);
        setClassData(classes);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to match classId and return class name
  const getClassName = (classId: string | number) => {
    const matchedClass = classData.find((cls) => cls.id === classId);
    return matchedClass ? matchedClass.name : "N/A";
  };

  // Prepare data for DynamicTable
  const tableData = {
    headers: [
      { id: "name", displayName: "Name", sortable: true },
      { id: "gender", displayName: "Gender", sortable: true },
      { id: "email", displayName: "Email", sortable: true },
      { id: "mobile", displayName: "Mobile", sortable: false },
      { id: "qualification", displayName: "Qualification", sortable: true },
      { id: "classTeacher", displayName: "Class Teacher", sortable: false },
    ],
    values: teachers.map((teacher) => ({
      ...teacher,
      qualification: teacher.qualification?.join(", ") || "N/A",
      classTeacher: teacher.responsibleForClassId
        ? getClassName(teacher.responsibleForClassId)
        : "✘",
    })),
    pagination: { pageSize: 5 },
  };

  return (
    <div className="p-3">
      <div className="bg-white w-full max-w-screen rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          📚 Teachers List
        </h1>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <DynamicTable
            data={tableData}
            onPageChange={() => {}}
            onSortingChange={() => {}}
            onFilterChange={() => {}}
          />
        )}
      </div>
    </div>
  );
}
