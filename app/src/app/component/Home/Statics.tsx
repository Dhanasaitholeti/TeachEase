import React from "react";

const Statistics = () => {
  return (
    <div className="mt-24 card">
      <div className="card-body">
        <div className="mb-20 flex flex-wrap gap-8 justify-between">
          <h4 className="mb-0">Study Statistics</h4>
          <div className="flex flex-wrap gap-16 items-center">
            <div className="flex flex-wrap gap-16 items-center">
              <div className="flex items-center gap-8">
                <span className="w-8 h-8 rounded-full bg-[#3E80F9]" />
                <span className="text-sm text-gray-600">Study</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="w-8 h-8 rounded-full bg-[#27CEA7]" />
                <span className="text-sm text-gray-600">Test</span>
              </div>
            </div>
            <select className="form-select form-control text-sm px-4 py-2 rounded-md w-auto">
              <option value="1">Yearly</option>
              <option value="1">Monthly</option>
              <option value="1">Weekly</option>
              <option value="1">Today</option>
            </select>
          </div>
        </div>

        <div id="doubleLineChart" className="tooltip-style y-value-left"></div>
      </div>
    </div>
  );
};

export default Statistics;
