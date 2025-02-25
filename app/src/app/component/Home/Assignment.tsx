import React from "react";
import { FaGraduationCap, FaCode, FaBezierCurve } from "react-icons/fa"; // You can import the icons from any library you use

const assignments = [
  {
    title: "Do The Research",
    dueIn: "9 days",
    icon: <FaGraduationCap size={24} />,
    link: "assignment",
  },
  {
    title: "PHP Development",
    dueIn: "2 days",
    icon: <FaCode size={24} />,
    link: "assignment.html",
  },
  {
    title: "Graphic Design",
    dueIn: "5 days",
    icon: <FaBezierCurve size={24} />,
    link: "assignment.html",
  },
];

const Assignment = () => {
  return (
    <div className="mt-24 card">
      <div className="card-body">
        <div className="mb-20 flex flex-wrap justify-between gap-8">
          <h4 className="mb-0">Assignments</h4>
          <a
            href="/dashboard/assignment"
            className="text-sm font-medium text-[#0759F1] hover:underline"
          >
            See All
          </a>
        </div>

        {/* Cards in a responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {assignments.map((assignment, index) => (
            <div
              key={index}
              className="p-4 py-8 px-12 flex justify-between gap-8 rounded-lg border border-gray-100 hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-8">
                <span className="text-[#0759F1] bg-[#E4F2FF] w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {assignment.icon}
                </span>
                <div>
                  <h6 className="mb-0 text-lg font-semibold">
                    {assignment.title}
                  </h6>
                  <span className="text-xs text-gray-400">{`Due in ${assignment.dueIn}`}</span>
                </div>
              </div>
              <a
                href={assignment.link}
                className="text-gray-900 hover:text-[#0759F1] flex items-center justify-center"
              >
                <i className="ph ph-caret-right"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
