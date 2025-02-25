"use client";
import React, { useState, useEffect } from "react";
import SyllabusInput from "./SyllabusInput";

import { Calendar } from "@/app/component/ui/calendar";
import HolidayList from "./HolidayList";

export default function SyllabusPlanner() {
  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Syllabus Planner 📚
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-[0.6]">
          <SyllabusInput />
        </div>
        <div className="flex-[0.4]">
          <HolidayList />
        </div>
      </div>
    </div>
  );
}