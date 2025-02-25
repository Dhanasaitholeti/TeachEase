import React, { useState, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Tesseract from "tesseract.js";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/app/component/ui/accordion";
import { uploadQuestionPaper } from "@/service/upload";
import { getAllSubjects, getClassIds } from "@/service/class";
import { getAllTeachers } from "@/service/teacherService";
import { Label } from "@/app/component/ui/label";
const MAX_FILES = 10;
interface Teacher {
  id: number;
  name: string;
}
interface Props {
  redirectPath?: string;
}

const FileUpload: React.FC<Props> = ({ redirectPath }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [classOptions, setClassOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [extractedTexts, setExtractedTexts] = useState<
    { fileName: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [editedTexts, setEditedTexts] = useState<{ [key: string]: string }>({});
  const [totalMarks, setTotalMarks] = useState<number>(50);
  const [difficultyLevel, setDifficultyLevel] = useState<string>("easy");
  const [classTeacherId, setClassTeacherId] = useState<string>("");
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<string>("MCQ");
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersList = await getAllTeachers();
        setTeachers(teachersList); // Set the teacher data
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setError("Failed to load teachers.");
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchClassIds = async () => {
      try {
        const data = await getClassIds();
        setClassOptions(data); // Expecting { id, name } objects
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClassIds();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClassId) {
        try {
          const subjectsList = await getAllSubjects(selectedClassId);

          setSubjects(subjectsList); // Store subjects in state
        } catch (err) {
          console.error("Error fetching subjects:", err);
          setError("Failed to load subjects.");
        }
      }
    };

    fetchSubjects();
  }, [selectedClassId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let newFiles = Array.from(e.target.files);

      if (selectedFiles.length + newFiles.length > MAX_FILES) {
        alert(`You can upload a maximum of ${MAX_FILES} images.`);
        return;
      }

      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setLoading(true);

      const newExtractedTexts = await Promise.all(
        newFiles.map(async (file) => {
          const imageURL = URL.createObjectURL(file);
          try {
            const { data } = await Tesseract.recognize(
              imageURL,
              "hin+eng+tel+tam+mal+kan",
              {
                logger: (m) => console.log(m),
              }
            );
            return { fileName: file.name, text: data.text };
          } catch (error) {
            console.error("OCR Error:", error);
            return { fileName: file.name, text: "Failed to extract text." };
          }
        })
      );

      setExtractedTexts((prevTexts) => [...prevTexts, ...newExtractedTexts]);
      setLoading(false);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(updatedFiles);

    const updatedTexts = extractedTexts.filter(
      (item) => item.fileName !== fileName
    );
    setExtractedTexts(updatedTexts);

    const updatedEditedTexts = { ...editedTexts };
    delete updatedEditedTexts[fileName];
    setEditedTexts(updatedEditedTexts);
  };

  const handleTextChange = (fileName: string, newText: string) => {
    setEditedTexts((prev) => ({
      ...prev,
      [fileName]: newText,
    }));
  };

  const handleSaveChanges = () => {
    const finalTexts = extractedTexts.map((item) =>
      editedTexts[item.fileName] !== undefined
        ? editedTexts[item.fileName]
        : item.text
    );

    toast({
      description: "Your Texts are saved.",
    });
    setOpenAccordions([]);
    console.log("Final Extracted Texts to Send:", finalTexts);
  };

  const handleSubmit = async () => {
    // Initialize router

    if (!selectedClassId || !subjectId || !classTeacherId) {
      toast({
        title: "Missing Information",
        description: "Please select a valid class, subject, and teacher.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.length > 0) {
      setIsLoading(true); // Start loading

      const finalTexts = extractedTexts.map((item) =>
        editedTexts[item.fileName] !== undefined
          ? editedTexts[item.fileName]
          : item.text
      );

      const payload = {
        marks: totalMarks,
        difficulty_level: difficultyLevel,
        lessons: finalTexts,
        testType: [selectedTestType],
        teacherId: classTeacherId,
        subjectId: subjectId,
        classId: selectedClassId,
      };

      console.log("Final payload:", payload);

      try {
        const response = await uploadQuestionPaper(payload);

        if (response.success) {
          localStorage.setItem("testId", response.payload);

          toast({
            description: "Files Uploaded Successfully",
          });

          console.log("Test ID saved:", response.payload);

          // router.push("/admin/dashboard/question-paper");
          router.push(redirectPath); // Redirect to dynamic path

          return redirectPath;
        } else {
          toast({
            title: "Upload Failed",
            description: response.message || "Something went wrong",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Failed to upload Files, Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "No Files Selected.",
        description: "Please select at least one file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      {/* File Upload */}
      <label
        htmlFor="file-upload"
        className="relative cursor-pointer flex flex-col items-center justify-center w-72 h-40 border-2 border-dashed border-gray-400 rounded-lg bg-white bg-opacity-40 hover:bg-opacity-50 transition-all duration-300"
      >
        <FaFileUpload className="text-5xl text-primary opacity-90" />
        <p className="mt-2 text-lg text-gray-900 font-medium">
          Click to upload (Max {MAX_FILES})
        </p>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {selectedFiles.map((file) => (
            <div
              key={file.name}
              className="relative flex flex-col items-center"
            >
              <button
                onClick={() => handleRemoveFile(file.name)}
                className="absolute top-[-13px] right-[-10px] w-7 h-7 text-white bg-primary rounded-full p-1 text-sm"
              >
                X
              </button>
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected file ${file.name}`}
                className="w-48 h-auto rounded-lg shadow-lg border border-gray-300"
              />
              <p className="text-center text-gray-900 text-sm mt-2">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="mt-4 text-primary">Extracting text...</p>}

      {/* Text Extraction Result */}
      {extractedTexts.length > 0 && (
        <div className="w-full flex justify-center">
          <Accordion
            type="multiple"
            value={openAccordions}
            onValueChange={setOpenAccordions}
            className="w-3/4 mt-6 space-y-4"
          >
            {extractedTexts.map(({ fileName, text }) => (
              <AccordionItem
                key={fileName}
                value={fileName}
                className="border rounded-lg shadow-md"
              >
                <AccordionTrigger className="px-4 py-3 text-lg font-medium bg-gray-200 rounded-t-lg hover:bg-gray-300">
                  {fileName}
                </AccordionTrigger>
                <AccordionContent className="p-5 bg-white rounded-b-lg border-t">
                  <textarea
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                    value={
                      editedTexts[fileName] !== undefined
                        ? editedTexts[fileName]
                        : text
                    }
                    onChange={(e) => handleTextChange(fileName, e.target.value)}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {extractedTexts.length > 0 && (
        <button
          onClick={handleSaveChanges}
          className="mt-4 px-3 py-1.5 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark transition-all duration-200 flex items-center gap-2"
        >
          <span>Save</span>
          📄
        </button>
      )}
      {/* Difficulty & Marks Input */}
      <div className="mt-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Total Marks Input */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-lg font-medium mb-2">Enter Total Marks</label>
          <input
            type="number"
            className="border border-gray-300 p-3 rounded-lg w-full text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            placeholder="Enter Total Marks"
          />
        </div>

        {/* Difficulty Level Select */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-lg font-medium mb-2 text-nowrap">
            Select Difficulty Level
          </label>
          <select
            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Test Type Dropdown */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-lg font-medium mb-2">Select Test Type</label>
          <select
            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedTestType}
            onChange={(e) => setSelectedTestType(e.target.value)}
          >
            <option value="">Select Test Type</option>
            <option value="MCQ">MCQ</option>
            <option value="THEORY">Theory</option>
            <option value="BLANKS">Fill in the Blanks</option>
            <option value="MIXED">Mixed</option>
          </select>
        </div>

        {/* Select Teacher Dropdown */}
        <div className="flex flex-col w-full md:w-1/3">
          <Label htmlFor="classTeacherId" className="text-lg font-medium mb-2">
            Select Teacher
          </Label>
          <select
            id="classTeacherId"
            name="classTeacherId"
            value={classTeacherId}
            onChange={(e) => setClassTeacherId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Class Dropdown */}
        <div className="flex flex-col w-full md:w-1/3">
          <Label htmlFor="classTeacher" className="text-lg font-medium mb-2">
            Select Class
          </Label>
          <select
            id="classTeacher"
            name="classTeacher"
            value={selectedClassId}
            onChange={(e) => {
              console.log("Selected Class ID:", e.target.value);
              setSelectedClassId(e.target.value);
            }}
            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Subject Dropdown */}
        <div className="flex flex-col w-full md:w-1/3">
          <Label htmlFor="subjectId" className="text-lg font-medium mb-2">
            Select Subject
          </Label>
          <select
            id="subjectId"
            name="subjectId"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      {/* Save Button */}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`mt-6 px-6 py-3 text-white rounded-lg flex items-center gap-2 transition-all ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            Uploading...
          </>
        ) : (
          <>
            Upload Test Papers <FaFileUpload />
          </>
        )}
      </button>
    </div>
  );
};

export default FileUpload;
