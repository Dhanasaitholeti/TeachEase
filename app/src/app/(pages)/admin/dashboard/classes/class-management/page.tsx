"use client";

import React, { useState, useEffect } from "react";
import DynamicDialog from "@/app/CommonComponents/DynamicDialog";
import CreateClassForm from "./CreateClassForm";
import Card from "@/app/CommonComponents/Cards";
import { getAllClasses } from "@/service/class";
import Loading from "@/app/loading";

const Page: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classData = await getAllClasses();
        console.log(classData);
        setClasses(classData);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [isDialogOpen]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 relative">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Classes</h1>
        <div className="absolute top-4 right-4">
          <DynamicDialog
            title="Add Class"
            description="Fill in the details to create a new class."
            triggerText="Add Class"
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            className="bg-primary text-white hover:bg-primary"
            titleClassName="text-primary font-semibold"
            desClassName="text-primary"
          >
            <CreateClassForm onSuccess={handleDialogClose} />
          </DynamicDialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {classes.map((classItem) => {
            const description = `Section: ${
              classItem.section || "N/A"
            }, Teacher: ${classItem.classTeacher?.name || "N/A"}, Medium: ${
              classItem?.medium || "N/A"
            }`;
            const href = `/teacher/dashboard/class-performance?adminId=${classItem.id}`;
            return (
              <Card
                key={classItem.id}
                id={classItem.id}
                title={classItem.name}
                description={description}
                href={href}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
