"use client";
import { useState, useEffect } from "react";
import InputField from "@/app/CommonComponents/InputField";
import { useToast } from "@/hooks/use-toast";
import SelectField from "@/app/CommonComponents/SelectField";
import { FaUser, FaEnvelope, FaPhone, FaSchool, FaKey } from "react-icons/fa";
import { getAllSubjectss, getClassIds } from "@/service/class";

import { addTeacher } from "@/service/teacherService";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    qualification: "",
    mobile: "",
    email: "",
    subject: "",
    classTeacher: "",
    classesTeaches: "",
    isAdmin: "",
  });

  const [classOptions, setClassOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [subjectOptions, setSubjectOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await getClassIds();
        setClassOptions(
          classData.map((item: { id: string; name: string }) => ({
            name: item.name,
            id: item.id,
          }))
        );

        const { rows } = await getAllSubjectss();
        setSubjectOptions(rows);
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

  const handleSubjectChange = (selectedId: string) => {
    setFormData({ ...formData, subject: selectedId });
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.qualification)
      newErrors.qualification = "Qualification is required";
    if (!formData.mobile) newErrors.mobile = "Mobile is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.classTeacher) newErrors.classTeacher = "Class is required";
    if (!formData.subject) newErrors.subject = "Subject is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!validate()) return;

    setLoading(true);
    try {
      await addTeacher({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        qualification: formData.qualification.split(",").map((q) => q.trim()),
        gender: formData.gender.toUpperCase() as "MALE" | "FEMALE" | "OTHER",
        responsibleForClassId: formData.classTeacher || null,
        subjectId: formData.subject,
      });

      toast({ description: "Teacher added Successfully" });
      setFormData({
        name: "",
        age: "",
        gender: "",
        qualification: "",
        mobile: "",
        email: "",
        subject: "",
        classTeacher: "",
        classesTeaches: "",
        isAdmin: "",
      });
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to add teacher.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBlue p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add <span className="text-blue-500">Teacher</span>
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            icon={<FaUser />}
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            error={errors.age}
          />
          <SelectField
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
            error={errors.gender}
          />
          <InputField
            label="Qualification (comma separated)"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            error={errors.qualification}
          />
          <InputField
            icon={<FaPhone />}
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            error={errors.mobile}
          />
          <InputField
            icon={<FaEnvelope />}
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <select
            name="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="">Select Subject</option>
            {subjectOptions.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject}</p>
          )}

          <select
            name="classTeacher"
            value={formData.classTeacher}
            onChange={(e) =>
              setFormData({ ...formData, classTeacher: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="">Select Class</option>
            {classOptions.map((classItem: { id: string; name: string }) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classTeacher && (
            <p className="text-red-500 text-sm">{errors.classTeacher}</p>
          )}

          <SelectField
            icon={<FaKey />}
            label="Is He Admin?"
            name="isAdmin"
            value={formData.isAdmin}
            onChange={handleChange}
            options={["Yes", "No"]}
            error={errors.isAdmin}
          />
          <button
            type="submit"
            className="col-span-2 w-full py-3 text-white bg-blue-600 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            {loading ? "Adding..." : "Add Teacher"}
          </button>
        </form>
      </div>
    </div>
  );
}
