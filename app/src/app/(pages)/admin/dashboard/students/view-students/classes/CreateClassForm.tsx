"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/component/ui/button";
import { Input } from "@/app/component/ui/input";
import { Label } from "@/app/component/ui/label";
import { DialogFooter } from "@/app/component/ui/dialog";
import { createClass } from "@/service/class";
import { getAllTeachers } from "@/service/teacherService";

interface Teacher {
  id: number;
  name: string;
}

interface CreateClassFormProps {
  onSuccess: () => void;
}

const CreateClassForm: React.FC<CreateClassFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    medium: "",
    section: "",
    classTeacherId: "",
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersList = await getAllTeachers();
        // console.log("Teachers List:", teachersList);
        setTeachers(teachersList); // Set only the extracted teacher data
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setError("Failed to load teachers.");
      }
    };
  
    fetchTeachers();
  }, []);
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      classTeacherId: formData.classTeacherId || null,
    };
console.log(payload)
    try {
      await createClass(payload);
      onSuccess();
    } catch (err) {
      console.error("Failed to create class:", err);
      setError("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <Label htmlFor="name" className="after:content-['*'] after:ml-0.5 after:text-red-500">
        Class Name
      </Label>
      <Input
        id="name"
        name="name"
        placeholder="e.g., Class I"
        value={formData.name}
        onChange={handleInputChange}
        required
      />
    </div>
    <div>
      <Label htmlFor="medium" className="after:content-['*'] after:ml-0.5 after:text-red-500">
        Medium
      </Label>
      <Input
        id="medium"
        name="medium"
        placeholder="e.g., English / Kannada / Hindi"
        value={formData.medium}
        onChange={handleInputChange}
        required
      />
    </div>
    <div>
      <Label htmlFor="section">
        Section
      </Label>
      <Input
        id="section"
        name="section"
        placeholder="e.g., Section-A"
        value={formData.section}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <Label htmlFor="classTeacherId">
        Class Teacher
      </Label>
      <select
        id="classTeacherId"
        name="classTeacherId"
        value={formData.classTeacherId}
        onChange={handleInputChange}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">Select a Class Teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>
    </div>
    {error && <p className="text-red-500">{error}</p>}
    <DialogFooter>
      <Button
        type="submit"
        className="bg-primary hover:bg-primary-dark"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Class"}
      </Button>
    </DialogFooter>
  </form>
  
  );
};

export default CreateClassForm;
