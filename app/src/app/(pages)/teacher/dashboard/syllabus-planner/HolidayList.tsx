"use client";
import React, { useState, useEffect } from "react";
import { FaSpinner, FaCalendarAlt } from "react-icons/fa";

const API_KEY = process.env.NEXT_PUBLIC_NINJAS_API_KEY;


export default function HolidayList() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [country, setCountry] = useState("IN"); // Default: India
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // Filter: all, week, month, 3months

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }

      const data = await response.json();
      setHolidays(data.response.holidays || []);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [year, country]);

  const filterHolidays = () => {
    const now = new Date();
    return holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date.iso);
      const diffInDays = (holidayDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);


      if (filter === "week") return diffInDays >= 0 && diffInDays <= 7;
      if (filter === "month") return diffInDays >= 0 && diffInDays <= 30;
      if (filter === "3months") return diffInDays >= 0 && diffInDays <= 90;
      return true;
    });
  };

  return (
    <div className="w-full mx-auto p-6 mt-10 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-primary" />
        Holiday List
      </h2>

      {/* Inputs: Year & Country */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter year"
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="IN">India 🇮🇳</option>
          {/* <option value="US">United States 🇺🇸</option>
          <option value="GB">United Kingdom 🇬🇧</option>
          <option value="CA">Canada 🇨🇦</option>
          <option value="AU">Australia 🇦🇺</option> */}
        </select>

      
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "week", "month", "3months"].map((key) => (
          <button
            key={key}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === key ? "bg-primary text-white" : "bg-gray-200"
            } hover:bg-primary hover:text-white transition`}
            onClick={() => setFilter(key)}
          >
            {key === "all"
              ? "All"
              : key === "week"
              ? "This Week"
              : key === "month"
              ? "This Month"
              : "Next 3 Months"}
          </button>
        ))}
      </div>

      {/* Holiday List */}
      {loading ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-primary" size={30} />
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50">
          {filterHolidays().length > 0 ? (
            <ul className="list-none space-y-2">
              {filterHolidays().map((holiday, index) => (
                <li
                  key={index}
                  className="p-3 bg-white shadow-sm border-l-4 border-blue-500 rounded-md"
                >
                  <strong>{holiday.name}</strong> - {holiday.date.iso}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No holidays found.</p>
          )}
        </div>
      )}
    </div>
  );
}
