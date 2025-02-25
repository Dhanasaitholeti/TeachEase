"use client";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { Card, CardContent } from "../ui/card";

const ScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <div className="w-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            // onChange={handleDateChange}
            className="w-full"
            // renderDay={(day: any) => (
            //   <div
            //     className={`flex justify-center items-center max-h-12 max-w-12 rounded-full text-sm transition-colors duration-200 ${
            //       day.toDateString() === selectedDate?.toDateString()
            //         ? "bg-[#0759F1] text-white"
            //         : "hover:bg-[#0759F1]/20 cursor-pointer"
            //     }`}
            //   >
            //     {day.getDate()}
            //   </div>
            // )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
