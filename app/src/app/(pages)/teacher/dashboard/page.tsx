"use client";

import { Calendar } from "@/app/component/ui/calendar";
import Assignment from "../../../component/Home/Assignment";
import Reminders from "@/app/component/Home/Reminders";
import TeacherDashboard from "@/app/component/Home/TeacherDashboard";
import AttendanceGraph from "@/app/component/Home/AttendanceGraph";
import CircularProgress from "@/app/component/Home/CircularProgress"; // Import the CircularProgress component
import { getReminders } from "@/service/class";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const progress = 4; // Example progress value
  const [data, setData] = useState();
  const handleDateSelect = async ({ date, relatedTo }) => {
    console.log("Selected Date (Raw):", date);

    // Convert to local date (YYYY-MM-DD HH:mm:ss)
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );

    // Format as 'YYYY-MM-DD HH:mm:ss' (local time)
    const formattedDate = `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1
    ).padStart(2, "0")}-${String(localDate.getDate()).padStart(
      2,
      "0"
    )} ${String(localDate.getHours()).padStart(2, "0")}:${String(
      localDate.getMinutes()
    ).padStart(2, "0")}:${String(localDate.getSeconds()).padStart(2, "0")}`;

    console.log("Formatted Local Date:", formattedDate);

    const response = await getReminders({ date: formattedDate, relatedTo });
    setData(response);
  };
  return (
    <div className="bg-[#ECF2FE] p-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-3">
        {/* Left Section: Teacher Dashboard & Attendance Graph */}
        <div className="flex flex-col gap-3 w-full px-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Teacher Dashboard - 3/4 width on large screens */}
            <div className="w-full lg:w-3/4">
              <TeacherDashboard />
            </div>

            {/* Circular Progress - 1/4 width on large screens */}
            <div className="w-full lg:w-1/4">
              <CircularProgress remainingHours={progress} />
            </div>
          </div>

          {/* Attendance Graph Below */}
          <div className="w-full">
            <AttendanceGraph />
          </div>
        </div>

        {/* Right Section: Calendar & Reminders */}
        <div className="mt-3 flex flex-col gap-3">
          <div className="bg-white rounded-md p-3 shadow-md border border-gray-200">
            <Calendar className="bg-white mx-auto" />
          </div>
          <Reminders
            reminders={data}
            relatedTo={"Teacher"}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
}
