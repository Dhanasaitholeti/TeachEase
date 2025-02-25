"use client";

import React, { useEffect, useState } from "react";
import { getTeacherProfile } from "@/service/teacherService";
import { getClassIds } from "@/service/class";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const TeacherDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [classList, setClassList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState<string>("");
  const search = useSearchParams();
  const mentorId = search.get("adminId");

  useEffect(() => {
    const fetchProfileAndClasses = async () => {
      try {
        setLoading(true);

        // Fetch teacher profile and class data in parallel for better performance
        const [teacherData, classData] = await Promise.all([
          mentorId ? getTeacherProfile(mentorId) : getTeacherProfile(),
          getClassIds(),
        ]);

        setProfile(teacherData);
        setClassList(classData);

        // Ensure teacherData and responsibleForClassId exist before accessing
        if (teacherData?.responsibleForClassId) {
          const matchedClass = classData.find(
            (cls: { id: number; name: string }) =>
              cls.id === teacherData.responsibleForClassId
          );
          setClassName(matchedClass ? matchedClass.name : "Not Assigned");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile and classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndClasses();
  }, [mentorId]);

  return (
    <div className="py-4 px-4 flex">
      <div className="bg-white w-full max-w-3xl  rounded-xl shadow-lg p-10 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10 border border-gray-200">
        {/* Profile Picture Placeholder */}
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-3xl font-semibold shadow-inner">
          {profile ? profile.name[0] : "?"}
        </div>

        {/* Profile Information */}
        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500 text-lg text-center">Loading...</p>
          ) : profile ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900">
                Hello, {profile.name}
              </h1>
              <p className="mt-3 text-lg text-gray-700">
                {profile.qualification?.join(", ") || "Teacher"}
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-base text-gray-600">
                  <span className="font-medium text-gray-800">📞 Mobile:</span>{" "}
                  {profile.mobile}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-medium text-gray-800">📧 Email:</span>{" "}
                  {profile.email}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-medium text-gray-800">
                    🏫 Class Teacher:
                  </span>{" "}
                  {className}
                </p>
              </div>
            </>
          ) : (
            <p className="text-red-500 text-lg text-center">
              Failed to load profile.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
