import globalAxios from "@/lib/globalAxios/globalAxios";

const generatedTestPaper = async () => {
  try {
    const testId = localStorage.getItem("testId"); 

    if (!testId) {
      throw new Error("No testId found in local storage");
    }

    const response = await globalAxios.get(`/api/teacher/test/${testId}`);
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching Test Paper:", error);
    throw error;
  }
};

export { generatedTestPaper };
