"use client";
import Loading from "@/app/loading";
import { addAttendance } from "@/service/class";
import { getAttendancePerDate } from "@/service/teacherService";

import React, { useState, useEffect } from "react";

// Types based on your data structure
type Student = {
  id: string;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE" | string;
  mobile: string;
};

type Teacher = {
  id: string;
  name: string;
  email: string;
  mobile: any;
};

type AttendanceRecord = {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT";
  studentId: string;
  teacherId: string | null;
  standardId: string;
};

type ClassData = {
  id: string;
  name: string;
  medium: string;
  section: string | null;
  classTeacherId: string;
  classTeacher: Teacher;
  students: Student[];
  Attendance: AttendanceRecord[];
  _count?: {
    students: number;
  };
};

// New type for API payload
type AttendancePayload = {
  userType: "STUDENT";
  status: "PRESENT" | "ABSENT";
  studentId: string;
  standardId: string;
}[];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString();
};

interface Props {
  data: any;
}

const AttendanceSystem = ({ data }: Props) => {
  const [classes, setClasses] = useState<ClassData[]>(data);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [takingAttendance, setTakingAttendance] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    getTodayDateString()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Prepare student attendance statuses for UI
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, "PRESENT" | "ABSENT" | "UNMARKED">
  >({});

  useEffect(() => {
    if (data) {
      setClasses(data);
    }
  }, [data]);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Fetch attendance data when class or date changes
  useEffect(() => {
    if (!selectedClassId) return;

    const fetchAttendanceSummary = async () => {
      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Disable future dates by resetting to today if selected date is in the future
      if (selectedDateObj > today) {
        console.log("hiii");
        setSelectedDate(getTodayDateString());
        return;
      }

      const formattedDate = selectedDateObj.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      setLoadingSummary(true);
      setAttendanceSummary(null);

      try {
        const summaryData = await getAttendancePerDate(selectedClassId, {
          date: formattedDate,
        });
        setAttendanceSummary(summaryData);

        // Update student statuses based on fetched attendance
        if (summaryData && summaryData.length > 0) {
          const newStatuses: Record<string, "PRESENT" | "ABSENT" | "UNMARKED"> =
            {};
          summaryData.forEach((record: any) => {
            newStatuses[record.studentId] = record.status;
          });
          setStudentStatuses(newStatuses);
        } else {
          // If no attendance records found, initialize all as unmarked
          initializeUnmarkedStatuses();
        }
      } catch (error) {
        console.error("Failed to fetch attendance summary:", error);
        setApiError("Failed to load attendance data");
        initializeUnmarkedStatuses();
      } finally {
        setLoadingSummary(false);
      }
    };

    const initializeUnmarkedStatuses = () => {
      const selectedClass = classes.find((c) => c.id === selectedClassId);
      if (!selectedClass) return;

      const statuses: Record<string, "PRESENT" | "ABSENT" | "UNMARKED"> = {};
      selectedClass.students.forEach((student) => {
        statuses[student.id] = "UNMARKED";
      });
      setStudentStatuses(statuses);
    };

    fetchAttendanceSummary();
  }, [selectedClassId, selectedDate, classes]);

  const selectedClass =
    selectedClassId !== null
      ? classes.find((c) => c.id === selectedClassId)
      : null;

  // Check if attendance is already taken for the selected date
  const isAttendanceTaken = () => {
    return attendanceSummary && attendanceSummary.length > 0;
  };

  const isDateInFuture = () => {
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0); // Normalize selected date to midnight

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    return selectedDateObj > today;
  };

  const isDateInPast = () => {
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0); // Normalize selected date to midnight

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    return selectedDateObj < today;
  };

  const formatDateForInput = (date: string) => {
    const localDate = new Date(date);
    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    ); // Adjust for local timezone
    return localDate.toISOString().split("T")[0];
  };
  const startAttendance = () => {
    if (isDateInFuture()) {
      setApiError("Cannot take attendance for future dates");
      return;
    }

    setTakingAttendance(true);
    setCurrentIndex(0);
    setApiError(null);
    setApiSuccess(false);
  };

  const validateAllMarked = () => {
    const unmarkedCount = Object.values(studentStatuses).filter(
      (status) => status === "UNMARKED"
    ).length;

    return unmarkedCount === 0;
  };

  const prepareAttendancePayload = (): AttendancePayload => {
    if (!selectedClassId || !selectedClass) return [];

    const payload: AttendancePayload = [];

    Object.entries(studentStatuses).forEach(([studentId, status]) => {
      if (status !== "UNMARKED") {
        payload.push({
          userType: "STUDENT",
          status,
          studentId,
          standardId: selectedClassId,
        });
      }
    });

    return payload;
  };

  const submitAttendanceToAPI = async (payload: AttendancePayload) => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const { success } = await addAttendance(payload);
      if (success) {
        setApiSuccess(true);
      }

      setClasses((prevClasses) => {
        const newAttendanceRecords: AttendanceRecord[] = payload.map(
          (item) => ({
            id: `${item.studentId}-${Date.now()}`,
            date: selectedDate,
            status: item.status,
            studentId: item.studentId,
            teacherId: selectedClass?.classTeacherId || null,
            standardId: item.standardId,
          })
        );

        return prevClasses.map((cls) =>
          cls.id === selectedClassId
            ? {
                ...cls,
                Attendance: [...cls.Attendance, ...newAttendanceRecords],
              }
            : cls
        );
      });

      // Update attendance summary after successful submission
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      const updatedSummary = await getAttendancePerDate(selectedClassId, {
        date: formattedDate,
      });
      setAttendanceSummary(updatedSummary);

      return true;
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeAttendance = async () => {
    if (!selectedClassId || !selectedClass) return;

    // Check if all students are marked
    if (!validateAllMarked()) {
      setApiError("Please mark attendance for all students before submitting");
      return;
    }

    // Prepare API payload
    const attendancePayload = prepareAttendancePayload();

    // Submit to API
    const success = await submitAttendanceToAPI(attendancePayload);

    if (success) {
      setTakingAttendance(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setSwipeDirection(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = currentTouch - touchStart;

    // Limit the swipe visual effect
    const swipe = Math.max(Math.min(diff / 2, 100), -100);
    setSwipeDirection(swipe);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !selectedClass) {
      resetSwipe();
      return;
    }

    // Determine if swipe was significant enough to count
    const threshold = 60;
    const student = selectedClass.students[currentIndex];

    if (swipeDirection > threshold) {
      markAttendance(student.id, "PRESENT");
    } else if (swipeDirection < -threshold) {
      markAttendance(student.id, "ABSENT");
    }

    resetSwipe();
  };

  const resetSwipe = () => {
    setTouchStart(null);
    setSwipeDirection(0);
  };

  const markAttendance = (studentId: string, status: "PRESENT" | "ABSENT") => {
    if (!selectedClass) return;

    // Update student status
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    // Move to next student if on mobile
    if (isMobile && currentIndex < selectedClass.students.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else if (isMobile && currentIndex === selectedClass.students.length - 1) {
      // If this was the last student, check if all are marked
      const allMarked = Object.values({
        ...studentStatuses,
        [studentId]: status,
      }).every((s) => s !== "UNMARKED");

      if (allMarked) {
        setTimeout(() => {
          setApiError(null);
          completeAttendance();
        }, 500);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-800";
      case "ABSENT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSummary = () => {
    if (!selectedClass) return { present: 0, absent: 0, unmarked: 0, total: 0 };

    const statuses = Object.values(studentStatuses);
    const present = statuses.filter((s) => s === "PRESENT").length;
    const absent = statuses.filter((s) => s === "ABSENT").length;
    const unmarked = statuses.filter((s) => s === "UNMARKED").length;
    const total = selectedClass.students.length;

    return { present, absent, unmarked, total };
  };

  // Class Selection View
  const renderClassSelection = () => {
    return (
      <div>
        <h2 className="text-lg font-medium mb-4">Select a Class</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            // Check if this class has attendance taken today
            const formattedToday = new Date().toISOString().split("T")[0];
            const hasAttendanceToday = cls.Attendance.some((record) => {
              const recordDate = new Date(record.date)
                .toISOString()
                .split("T")[0];
              return recordDate === formattedToday;
            });

            // Count total students
            const totalStudents = cls.students.length;

            // Count present students today
            const presentToday = cls.Attendance.filter((record) => {
              const recordDate = new Date(record.date)
                .toISOString()
                .split("T")[0];
              return (
                recordDate === formattedToday && record.status === "PRESENT"
              );
            }).length;

            return (
              <div
                key={cls.id}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-md lg:h-36 transition-shadow ${
                  selectedClassId === cls.id
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedClassId(cls.id)}
              >
                <h3 className="font-medium">{cls.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  medium: {cls.medium}{" "}
                  {cls.section ? `Section ${cls.section}` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  {totalStudents} {totalStudents === 1 ? "student" : "students"}
                </p>

                {hasAttendanceToday && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Today's attendance taken
                    </span>
                  </div>
                )}

                {hasAttendanceToday && (
                  <div className="mt-2 text-xs text-gray-500">
                    {presentToday} present, {totalStudents - presentToday}{" "}
                    absent
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Class Summary View
  const renderClassSummary = () => {
    if (!selectedClass) return null;

    const summary = getSummary();
    const attendanceTaken = isAttendanceTaken();
    const dateInFuture = isDateInFuture();
    const istDateString = (date: Date) => {
      return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // Format as YYYY-MM-DD
    };
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {selectedClass.name}{" "}
            {selectedClass.section ? `Section ${selectedClass.section}` : ""}
          </h2>
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 relative z-10"
            onClick={() => setSelectedClassId(null)}
          >
            Back to Classes
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attendance Date
          </label>
          <input
            type="date"
            className="p-2 border rounded w-full max-w-xs"
            value={formatDateForInput(selectedDate)}
            onChange={(e) => {
              const newDate = new Date(e.target.value + "T00:00:00"); // Treat as local date

              const today = new Date();
              today.setHours(0, 0, 0, 0); // Normalize today's date

              if (newDate > today) {
                setApiError("Cannot select future dates");
                return;
              }

              setApiError(null);
              setSelectedDate(istDateString(newDate)); // Store in IST format (YYYY-MM-DD)
            }}
            max={new Date().toLocaleDateString("en-CA", {
              timeZone: "Asia/Kolkata",
            })} // Ensure max date is in YYYY-MM-DD format
          />
        </div>

        {loadingSummary ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : dateInFuture ? (
          <div className="text-center py-8">
            <p className="text-red-600">
              Cannot view or take attendance for future dates
            </p>
          </div>
        ) : !attendanceTaken && isDateInPast() ? (
          <div className="flex justify-center py-8">
            No Attendance Available At This Moment.
          </div>
        ) : attendanceTaken ? (
          <>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">
                Attendance Summary for {formatDate(selectedDate)}
              </h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <div className="p-2 bg-white rounded border">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-medium">{summary.total}</div>
                </div>
                <div className="p-2 bg-green-50 rounded border border-green-100">
                  <div className="text-sm text-green-600">Present</div>
                  <div className="text-xl font-medium text-green-700">
                    {summary.present}
                  </div>
                  <div className="text-xs text-green-600">
                    {Math.round((summary.present / summary.total) * 100)}%
                  </div>
                </div>
                <div className="p-2 bg-red-50 rounded border border-red-100">
                  <div className="text-sm text-red-600">Absent</div>
                  <div className="text-xl font-medium text-red-700">
                    {summary.absent}
                  </div>
                  <div className="text-xs text-red-600">
                    {Math.round((summary.absent / summary.total) * 100)}%
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded border">
                  <div className="text-sm text-gray-600">Unmarked</div>
                  <div className="text-xl font-medium">{summary.unmarked}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Student Details</h3>
              {!isDateInPast() && (
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    // Reset all students statuses to unmarked
                    const resetStatuses: Record<
                      string,
                      "PRESENT" | "ABSENT" | "UNMARKED"
                    > = {};
                    selectedClass.students.forEach((student) => {
                      resetStatuses[student.id] = "UNMARKED";
                    });
                    setStudentStatuses(resetStatuses);
                    startAttendance();
                  }}
                >
                  Retake Attendance
                </button>
              )}
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Gender</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedClass.students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-200">
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.gender}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${getStatusColor(
                          studentStatuses[student.id] || "UNMARKED"
                        )}`}
                      >
                        {studentStatuses[student.id] || "UNMARKED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="text-center py-8">
            {apiError ? (
              <p className="text-red-600 mb-4">{apiError}</p>
            ) : (
              <p className="mb-4">
                No attendance records found for {selectedClass.name} on{" "}
                {formatDate(selectedDate)}
              </p>
            )}

            {!dateInFuture && (
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={startAttendance}
              >
                Take Attendance
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Mobile Card View for Attendance
  const renderMobileAttendanceView = () => {
    if (!selectedClass || !selectedClass.students.length) return null;

    const student = selectedClass.students[currentIndex];
    const summary = getSummary();

    return (
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded"
            onClick={() => {
              setTakingAttendance(false);
            }}
          >
            Cancel
          </button>

          <div className="text-sm">
            {currentIndex + 1} of {selectedClass.students.length} students
          </div>

          {summary.unmarked === 0 && !isSubmitting && (
            <button
              className="px-3 py-1 text-sm bg-green-600 text-white rounded"
              onClick={completeAttendance}
            >
              Finish
            </button>
          )}

          {isSubmitting && (
            <div className="px-3 py-1 text-sm">Submitting...</div>
          )}
        </div>

        {apiError && (
          <div className="w-full mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
            {apiError}
          </div>
        )}

        <div
          className="w-full max-w-xs p-6 rounded-xl shadow-md bg-white border"
          style={{
            transform: `translateX(${swipeDirection}px) rotate(${
              swipeDirection / 20
            }deg)`,
            transition: touchStart ? "none" : "transform 0.3s ease",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h2 className="text-xl font-bold mb-2">{student.name}</h2>
          <p className="text-gray-600 mb-4">{student.gender}</p>

          <div className="flex justify-center mb-4">
            <span
              className={`px-3 py-1 rounded ${getStatusColor(
                studentStatuses[student.id] || "UNMARKED"
              )}`}
            >
              {studentStatuses[student.id] || "UNMARKED"}
            </span>
          </div>

          <div className="flex justify-between items-center mt-6 text-gray-400 text-sm">
            <div>← Swipe left for Absent</div>
            <div>Swipe right for Present →</div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-1/2 flex justify-between px-4 pointer-events-none opacity-50">
          <div
            className={`p-2 rounded-full bg-red-100 ${
              swipeDirection < -40 ? "opacity-100" : "opacity-0"
            }`}
          >
            ❌
          </div>
          <div
            className={`p-2 rounded-full bg-green-100 ${
              swipeDirection > 40 ? "opacity-100" : "opacity-0"
            }`}
          >
            ✅
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() =>
              currentIndex > 0 && setCurrentIndex(currentIndex - 1)
            }
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() =>
              currentIndex < selectedClass.students.length - 1 &&
              setCurrentIndex(currentIndex + 1)
            }
            disabled={currentIndex === selectedClass.students.length - 1}
          >
            Next
          </button>
        </div>

        {currentIndex === selectedClass.students.length - 1 &&
          summary.unmarked === 0 &&
          !isSubmitting && (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
              onClick={completeAttendance}
            >
              Complete Attendance
            </button>
          )}

        {isSubmitting && (
          <div className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded">
            Submitting attendance...
          </div>
        )}
      </div>
    );
  };

  // Desktop Table View for Attendance
  const renderDesktopAttendanceView = () => {
    if (!selectedClass) return null;

    const summary = getSummary();

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            Taking Attendance: {selectedClass.name} ({formatDate(selectedDate)})
          </h2>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setTakingAttendance(false)}
            >
              Cancel
            </button>

            <button
              className={`px-3 py-1 text-sm ${
                summary.unmarked > 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : isSubmitting
                  ? "bg-blue-400"
                  : "bg-green-600 hover:bg-green-700"
              } text-white rounded`}
              onClick={completeAttendance}
              disabled={summary.unmarked > 0 || isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : summary.unmarked > 0
                ? `${summary.unmarked} students unmarked`
                : "Complete Attendance"}
            </button>
          </div>
        </div>

        {apiError && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {apiError}
          </div>
        )}

        {apiSuccess && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            Attendance successfully submitted!
          </div>
        )}

        <div className="flex justify-between mb-4 text-sm">
          <span className="px-2 py-1 rounded bg-green-100 text-green-800">
            Present: {summary.present}
          </span>
          <span className="px-2 py-1 rounded bg-red-100 text-red-800">
            Absent: {summary.absent}
          </span>
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-800">
            Unmarked: {summary.unmarked}
          </span>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Gender</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedClass.students.map((student) => (
              <tr key={student.id} className="border-b border-gray-200">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.gender}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${getStatusColor(
                      studentStatuses[student.id] || "UNMARKED"
                    )}`}
                  >
                    {studentStatuses[student.id] || "UNMARKED"}
                  </span>
                </td>
                <td className="p-2 flex justify-center space-x-2">
                  <button
                    className={`px-3 py-1 rounded ${
                      studentStatuses[student.id] === "PRESENT"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                    onClick={() => markAttendance(student.id, "PRESENT")}
                    disabled={isSubmitting}
                  >
                    Present
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      studentStatuses[student.id] === "ABSENT"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => markAttendance(student.id, "ABSENT")}
                    disabled={isSubmitting}
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Main render logic
  return (
    <div className="bg-white rounded-md min-h-screen m-3 p-4">
      <h1 className="text-xl font-bold mb-6">School Attendance System</h1>

      {!selectedClassId && renderClassSelection()}

      {selectedClassId && !takingAttendance && renderClassSummary()}

      {selectedClassId &&
        takingAttendance &&
        (isMobile
          ? renderMobileAttendanceView()
          : renderDesktopAttendanceView())}
    </div>
  );
};

export default AttendanceSystem;
