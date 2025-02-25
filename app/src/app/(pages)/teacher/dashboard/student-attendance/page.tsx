"use client";
import AttendanceSystem from "@/app/component/AttendanceSystem/AttendanceSystem";
import DynamicBreadcrumb from "@/app/component/DynamicBreadCrumb/DynamicBreadCrumb";
import { getAllClasses } from "@/service/class";
import { useEffect, useState } from "react";

export default function StudentAttendance() {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const classData = await getAllClasses();
        if (classData) {
          setData(classData);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClass();
  }, []);

  return (
    <div className="p-3">
      <div className="px-3">
        <DynamicBreadcrumb
          items={[
            { label: "Home", href: "/teacher/dashboard/" },
            {
              label: "Student Attendance",
              href: "/teacher/dashboard/student-attendance",
            },
          ]}
        />
      </div>

      <AttendanceSystem data={data} />
    </div>
  );
}
