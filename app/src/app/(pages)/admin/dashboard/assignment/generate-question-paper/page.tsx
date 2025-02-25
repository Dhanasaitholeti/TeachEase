"use client";
import React, { useState } from "react";
import Instructions from "../Instructions";
import FileUpload from "../FileUpload";

const AssignmentUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBlue p-6">
      <div className="w-full max-w-screen bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-xl p-10 border border-gray-300">
        {/* Heading Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Test Paper Upload
          </h2>
          <p className="text-lg text-gray-700">
            Upload Images to Generate Test Paper
          </p>
        </div>

        {/* Instructions Section */}
        <Instructions />

        {/* File Upload Section */}
        <FileUpload redirectPath="/admin/dashboard/question-paper" />

        {/* Submit Button */}
      </div>
    </div>
  );
};

export default AssignmentUpload;
