"use client";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import { planSyllabus } from "@/service/syllabusService";
import { useToast } from "@/hooks/use-toast";

export default function SyllabusInput() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [subtopics, setSubtopics] = useState([""]);
  const [timePeriod, setTimePeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubtopicChange = (index: number, value: string) => {
    const updatedSubtopics = [...subtopics];
    updatedSubtopics[index] = value;
    setSubtopics(updatedSubtopics);
  };

  const addSubtopic = () => {
    setSubtopics([...subtopics, ""]);
  };

  const removeSubtopic = (index: number) => {
    setSubtopics(subtopics.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload = {
      topic,
      subtopics: subtopics.filter((s) => s.trim() !== ""), // Remove empty subtopics
      timePeriod,
      startDate,
      endDate,
    };

    try {
      setLoading(true);
      await planSyllabus(payload);
      toast({
        title: "Success",
        description: "Syllabus saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save syllabus. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 rounded-lg mt-10 border border-gray-300 shadow-sm">
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Subtopics
        </label>
        {subtopics.map((subtopic, index) => (
          <div key={index} className="flex items-center gap-3 mb-2">
            <input
              type="text"
              value={subtopic}
              onChange={(e) => handleSubtopicChange(index, e.target.value)}
              placeholder={`Subtopic ${index + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="p-2 text-red-600 rounded hover:bg-red-100"
              onClick={() => removeSubtopic(index)}
            >
              <MdDelete size={24} />
            </button>
          </div>
        ))}
        <button
          className="mt-2 px-4 py-2 text-primary border border-blue-400 rounded-lg hover:bg-blue-100"
          onClick={addSubtopic}
        >
          + Add Subtopic
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Time Period
        </label>
        <input
          type="text"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          placeholder="Eg. 10 days / today / 1 month"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        className="w-full py-3 mt-4 text-white bg-primary rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex justify-center items-center gap-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <AiOutlineLoading size={24} className="animate-spin" />
        ) : (
          "Save Plan"
        )}
      </button>
    </div>
  );
}
