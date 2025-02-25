"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "@/app/component/ui/input";
import { Button } from "@/app/component/ui/button";
import { Label } from "@/app/component/ui/label";
import { toast } from "react-toastify";
import { addStudent } from "@/service/teacherService";
import { getClassIds } from "@/service/class";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/component/ui/select";

const studentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  dateofbirth: z.string().min(1, "Date of birth is required"),
  adress: z.string().min(5, "Address must be at least 5 characters"),
  mobile: z.string().min(2, "Invalid mobile number"),
  gaurdianName: z
    .string()
    .min(3, "Guardian name must be at least 3 characters"),
  gaurdianMobile: z.string().min(3, "Invalid guardian mobile number"),
  standardId: z.string().min(1, "Please select a class"),
  email: z
    .string()
    .optional()
    .refine((email) => !email || z.string().email().safeParse(email).success, {
      message: "Invalid email",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  bloodGroup: z.string().min(2, "Invalid blood group"),
  govDocs: z.array(z.string().min(1, "Invalid Aadhaar number")),
});

export default function StudentRegistrationForm() {
  const [classOptions, setClassOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    dateofbirth: "",
    adress: "",
    mobile: "",
    gaurdianName: "",
    gaurdianMobile: "",
    standardId: "",
    email: "",
    password: "",
    gender: "MALE",
    bloodGroup: "",
    govDocs: [""],
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "govDocs" ? [value] : value,
    }));
  };

  // Handler for Select component
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      standardId: value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First validate the form data
      const validation = studentSchema.safeParse(formData);
      if (!validation.success) {
        const errorMessages = validation.error.flatten().fieldErrors;
        setErrors(
          Object.keys(errorMessages).reduce((acc, key) => {
            acc[key] = errorMessages[key]?.[0];
            return acc;
          }, {} as Record<string, string | undefined>)
        );
        toast.error("Please fix the errors and try again.");
        return;
      }

      let formattedData = { ...formData };

      if (formData.dateofbirth) {
        formattedData = {
          ...formData,
          dateofbirth: new Date(formData.dateofbirth).toISOString(), // This will be sent as is and parsed as Date on server
        };
      }

      await addStudent(formattedData);
      toast.success("Student registered successfully.");

      // Reset form
      setFormData({
        name: "",
        dateofbirth: "",
        adress: "",
        mobile: "",
        gaurdianName: "",
        gaurdianMobile: "",
        standardId: "",
        email: "",
        password: "",
        gender: "MALE",
        bloodGroup: "",
        govDocs: [""],
      });
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  useEffect(() => {
    const fetchClassIds = async () => {
      try {
        const response = await getClassIds();
        setClassOptions(response);
      } catch (error) {
        console.error("Error fetching Class IDs:", error);
      }
    };

    fetchClassIds();
  }, []);

  return (
    <div className=" mx-auto">
      <form
        onSubmit={handleSubmit}
        className="mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="standardId">Select Class:</Label>
          <Select
            value={formData.standardId}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.standardId && (
            <p className="text-red-500 text-sm">{errors.standardId}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* High Priority Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateofbirth">Date of Birth</Label>
            <Input
              id="dateofbirth"
              name="dateofbirth"
              type="date"
              value={formData.dateofbirth}
              onChange={handleChange}
              className="w-full"
            />
            {errors.dateofbirth && (
              <p className="text-red-500 text-sm">{errors.dateofbirth}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="adress">Address</Label>
            <Input
              id="adress"
              name="adress"
              value={formData.adress}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full"
            />
            {errors.adress && (
              <p className="text-red-500 text-sm">{errors.adress}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gaurdianName">Guardian Name</Label>
            <Input
              id="gaurdianName"
              name="gaurdianName"
              value={formData.gaurdianName}
              onChange={handleChange}
              placeholder="Enter guardian name"
              className="w-full"
            />
            {errors.gaurdianName && (
              <p className="text-red-500 text-sm">{errors.gaurdianName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gaurdianMobile">Guardian Mobile</Label>
            <Input
              id="gaurdianMobile"
              name="gaurdianMobile"
              value={formData.gaurdianMobile}
              onChange={handleChange}
              placeholder="Enter guardian mobile"
              className="w-full"
            />
            {errors.gaurdianMobile && (
              <p className="text-red-500 text-sm">{errors.gaurdianMobile}</p>
            )}
          </div>

          {/* Lower Priority Fields */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email (optional)"
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleGenderChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Input
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              placeholder="Enter blood group"
              className="w-full"
            />
            {errors.bloodGroup && (
              <p className="text-red-500 text-sm">{errors.bloodGroup}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="govDocs">Aadhaar Number</Label>
            <Input
              id="govDocs"
              name="govDocs"
              value={formData.govDocs[0]}
              onChange={handleChange}
              placeholder="Enter Aadhaar number"
              className="w-full"
            />
            {errors.govDocs && (
              <p className="text-red-500 text-sm">{errors.govDocs}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Register Student
        </Button>
      </form>
    </div>
  );
}
