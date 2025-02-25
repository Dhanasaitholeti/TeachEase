"use client";
import Image from "next/image";
import Dashboard from "../../../component/Home/UserDashboard";
import { Calendar } from "@/app/component/ui/calendar";
import Assignment from "../../../component/Home/Assignment";
import Reminders from "@/app/component/Home/Reminders";
import SchoolGraph from "@/app/component/Home/SchoolGraph/SchoolGraph";
import Statistics from "@/app/component/Home/Statics";
import { useEffect, useState } from "react";
import { getReminders } from "@/service/class";

export default function Home() {
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
    <div className="bg-[#ECF2FE]">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-3">
        <div className="flex flex-col gap-3 w-full px-3">
          <Dashboard />
          <SchoolGraph />
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <div className="bg-white rounded-md p-3 shadow-md border border-gray-200  ">
            <Calendar className="bg-white mx-auto" />
          </div>

          <Reminders
            reminders={data}
            relatedTo="Admin"
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
      <div>
        {/* <Statistics /> */}
        {/* <Assignment /> */}
      </div>
    </div>
  );
}
