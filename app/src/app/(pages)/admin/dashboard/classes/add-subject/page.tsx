"use client";
import { getClassIds, createSubject } from "@/service/class";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Label } from "@/app/component/ui/label";
import { FaSchool } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { getAllTeachers } from "@/service/teacherService";

export default function Page() {
  const [classOptions, setClassOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [teacherOptions, setTeacherOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [formData, setFormData] = useState({
    classTeacher: "",
    subjectName: "",
    teacherId: "",
  });
  const [errors, setErrors] = useState<{
    classTeacher?: string;
    subjectName?: string;
    teacherId?: string;
  }>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classes, teachers] = await Promise.all([
          getClassIds(),
          getAllTeachers(),
        ]);
        setClassOptions(classes);
        setTeacherOptions(teachers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.classTeacher ||
      !formData.subjectName ||
      !formData.teacherId
    ) {
      setErrors({
        classTeacher: !formData.classTeacher ? "Class is required" : "",
        subjectName: !formData.subjectName ? "Subject name is required" : "",
        teacherId: !formData.teacherId ? "Teacher is required" : "",
      });
      return;
    }

    try {
      await createSubject({
        name: formData.subjectName,
        classId: formData.classTeacher,
        teacherId: formData.teacherId,
      });

      toast({ title: "Subject Created Successfully" });
      setFormData({ classTeacher: "", subjectName: "", teacherId: "" });
    } catch (error) {
      toast({ title: "Failed to Create Subject", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Create Subject
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class Teacher Selection */}
        <div>
          <Label htmlFor="classTeacher" className="font-medium">
            Select Class
          </Label>
          <div className="relative">
            <FaSchool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              id="classTeacher"
              name="classTeacher"
              value={formData.classTeacher}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classOptions.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          {errors.classTeacher && (
            <p className="text-red-500 text-sm">{errors.classTeacher}</p>
          )}
        </div>

        {/* Teacher Selection */}
        <div>
          <Label htmlFor="teacherId" className="font-medium">
            Assign Teacher
          </Label>
          <div className="relative">
            <FaChalkboardTeacher className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              id="teacherId"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Teacher</option>
              {teacherOptions.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          {errors.teacherId && (
            <p className="text-red-500 text-sm">{errors.teacherId}</p>
          )}
        </div>

        {/* Subject Name Input */}
        <div>
          <Label htmlFor="subjectName" className="font-medium">
            Subject Name
          </Label>
          <input
            id="subjectName"
            name="subjectName"
            type="text"
            value={formData.subjectName}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subject name"
          />
          {errors.subjectName && (
            <p className="text-red-500 text-sm">{errors.subjectName}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Create Subject
        </button>
      </form>
    </div>
  );
}
