import globalAxios from "@/lib/globalAxios/globalAxios";

const uploadQuestionPaper = async (payload: {
  marks: number;
  difficulty_level: string;
  lessons: string[];
  testType: string[];
  teacherId: string;
  subjectId: string;
  classId: string;
}) => {
  try {
    const response = await globalAxios.post(
      "api/teacher/generate-test-paper",
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw error;
  }
};

export { uploadQuestionPaper };
