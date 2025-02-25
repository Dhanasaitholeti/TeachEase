import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/component/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/component/ui/popover";
import { Calendar as CalendarComponent } from "@/app/component/ui/calendar";
import { format, formatDistanceToNow } from "date-fns";

interface ReminderType {
  id: string;
  title: string;
  description: string;
  priority: string;
  dateOfReminder: string;
  status: string;
  adminId: string | null;
  teacherId: string | null;
  created_at: string;
  updated_at: string;
}

interface RemindersProps {
  reminders: ReminderType[];
  relatedTo: "Admin" | "Teacher";
  onDateSelect: (data: { date: Date; relatedTo: "Admin" | "Teacher" }) => void;
}

const Reminders = ({
  reminders = [],
  relatedTo,
  onDateSelect,
}: RemindersProps) => {
  // Get current date in local timezone (which will be Indian time if running in India)
  const getIndianDate = () => {
    const now = new Date();
    // Reset the time to start of day to ensure consistent date selection
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getIndianDate());

  // Load today's reminders on initial render
  useEffect(() => {
    onDateSelect({
      date: selectedDate,
      relatedTo,
    });
  }, []); // Empty dependency array means this runs once on mount

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Reset time to start of day for consistent date handling
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      setSelectedDate(normalizedDate);
      onDateSelect({
        date: normalizedDate,
        relatedTo,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600";
      case "medium":
        return "bg-yellow-50 text-yellow-600";
      case "low":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-md  max-h-[500px] overflow-y-scroll">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-lg font-semibold">Reminders</h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar size={16} />
                {format(selectedDate, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition hover:border-gray-300"
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full",
                    getPriorityColor(reminder.priority)
                  )}
                >
                  <Calendar size={24} />
                </span>
                <div className="space-y-1">
                  <h6 className="text-base font-medium text-gray-900">
                    {reminder.title}
                  </h6>
                  <p className="text-sm text-gray-500">
                    {reminder.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      Due{" "}
                      {formatDistanceToNow(new Date(reminder.dateOfReminder), {
                        addSuffix: true,
                      })}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{reminder.status}</span>
                  </div>
                </div>
              </div>
              {/* <Link
                href={`/reminders/${reminder.id}`}
                className="text-gray-900 hover:text-blue-600"
              >
                <ChevronRight size={20} />
              </Link> */}
            </div>
          ))}
          {reminders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reminders for this date
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
