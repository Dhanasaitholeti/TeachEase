import globalAxios from "@/lib/globalAxios/globalAxios";

interface Teacher {
  email: string;
  mobile: string;
  qualification: string[];
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  responsibleForClassId: string | null;
}

interface Student {
  email: string;
  name: string;
  password: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  mobile: string;
  gaurdianName: string;
  gaurdianMobile: string;
  adress: string;
  dateofbirth: string;
  bloodGroup: string;
  govDocs: string[];
  standardId: string;
}

const addTeacher = async (payload: any): Promise<any> => {
  try {
    const response = await globalAxios.post("api/admin/teacher", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

const addStudent = async (payload: any): Promise<any> => {
  try {
    const response = await globalAxios.post("api/admin/student", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const getAttendancePerDate = async (id: any, date: any) => {
  try {
    const response = await globalAxios.post(
      `api/teacher/get-attendance/class/${id}`,
      date
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching Class:", error);
    throw error;
  }
};
export const getStudentsById = async (id: any) => {
  try {
    const response = await globalAxios.get(
      `api/teacher/get-all-students/${id}  `
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching Class:", error);
    throw error;
  }
};
const getTeacherProfile = async (adminId?: any) => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (userData.type !== "teacher") {
      console.log("Unauthorized: User is not a teacher.");
    }

    const teacherId = userData.id;
    const response = await globalAxios.get(
      `/api/admin/teacher/${adminId ? adminId : teacherId}`
    );

    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching teacher profile:", error);
    throw error;
  }
};

const getStudentAttendance = async (classId: string) => {
  try {
    if (!classId) {
      throw new Error("Class ID is required.");
    }

    const response = await globalAxios.get(
      `api/teacher/student/get-attendance-report/${classId}`
    );

    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};

const getAllTeachers = async () => {
  try {
    const response = await globalAxios.get("/api/admin/teacher/all");
    return response.data.payload.rows;
  } catch (error: any) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};
export {
  addTeacher,
  addStudent,
  getTeacherProfile,
  getAllTeachers,
  getStudentAttendance,
};
