import globalAxios from "@/lib/globalAxios/globalAxios";
interface SyllabusPayload {
    topic: string;
    subtopics: string[];
    timePeriod: string;
    startDate: string;
    endDate: string;
  }
  
  const planSyllabus = async (payload: SyllabusPayload) => {
    try {
      const response = await globalAxios.post("api/teacher/generate/syllabus-plan", payload);
      return response.data;
    } catch (error: any) {
      console.error("Error creating syllabus plan:", error);
      throw error;
    }
  };
export {planSyllabus}  