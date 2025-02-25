"use client";
import React, { useState, useEffect } from "react";
import { generatedTestPaper } from "@/service/testService";

export default function QuestionPaper() {
  const [testPaper, setTestPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestPaper = async () => {
      try {
        const data = await generatedTestPaper();
        console.log(data)
        setTestPaper(data);
      } catch (err) {
        setError("Failed to fetch test paper.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestPaper();
  }, []);

  
  const hasQuestions =
    testPaper &&
    testPaper.questionPaper &&
    Object.values(testPaper.questionPaper).some(
      (section) => Array.isArray(section) && section.length > 0
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Question Paper
        </h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {testPaper && hasQuestions ? (
          <div className="space-y-6">
            {/* Render MCQs if available */}
            {testPaper.questionPaper.mcq?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Multiple Choice Questions
                </h3>
                <ol className="list-decimal pl-5 space-y-4">
                  {testPaper.questionPaper.mcq.map((mcq, index) => (
                    <li key={index} className="mt-2">
                      <p className="font-medium">{mcq.question}</p>
                      <ul className="list-none pl-4 space-y-1">
                        {mcq.options.map((option, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="mr-2 font-semibold">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {option}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Render Short Answer Questions if available */}
            {testPaper.questionPaper.short_answers?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Short Answer Questions
                </h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {testPaper.questionPaper.short_answers.map(
                    (question, index) => (
                      <li key={index}>{question}</li>
                    )
                  )}
                </ol>
              </div>
            )}

            {/* Render Fill in the Blanks if available */}
            {testPaper.questionPaper.fill_in_the_blanks?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Fill in the Blanks
                </h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {testPaper.questionPaper.fill_in_the_blanks.map(
                    (question, index) => (
                      <li key={index}>{question}</li>
                    )
                  )}
                </ol>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-500">No questions available.</p>
          )
        )}
      </div>
    </div>
  );
}
