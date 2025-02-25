import React from "react";

const Instructions: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-primary">Instructions</h3>
      <ul className="list-disc ml-6 text-gray-700 space-y-2 mt-2">
        <li>Ensure the image is clear and legible.</li>
        <li>Accepted formats: .jpg, .jpeg, .png.</li>
        <li>File size should not exceed 5 MB.</li>
      </ul>
    </div>
  );
};

export default Instructions;
