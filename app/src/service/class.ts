import globalAxios from "@/lib/globalAxios/globalAxios";

interface CreateClassPayload {
  name: string;
  medium: string;
  section?: string;
  classTeacherId?: string | null;
}

const createClass = async (payload: CreateClassPayload) => {
  try {
    const response = await globalAxios.post("/api/admin/class/", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating class:", error);
    throw error;
  }
};

const getAllClasses = async () => {
  try {
    const response = await globalAxios.get("api/admin/class/");
    return response.data.payload.rows;
  } catch (error: any) {
    console.error("Error fetching Class:", error);
    throw error;
  }
};

const getClassIds = async () => {
  try {
    const response = await globalAxios.get("api/admin/class/get-class-ids ");
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching Class:", error);
    throw error;
  }
};

const getAllSubjects = async (classId: string) => {
  try {
    const response = await globalAxios.get(
      `api/admin/subject/class-subjects/${classId}`
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getAllSubjectss = async () => {
  try {
    const response = await globalAxios.get(`api/admin/subject/all `);
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

const addAttendance = async (payload: any) => {
  try {
    const response = await globalAxios.post(
      "/api/teacher/take-attendance",
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating class:", error);
    throw error;
  }
};
interface SubjectPayload {
  name: string;
  classId: string;
  teacherId: string;
}
const createSubject = async (payload: SubjectPayload) => {
  try {
    const response = await globalAxios.post("api/admin/subject/ ", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating class:", error);
    throw error;
  }
};

export const getAllClassAttendance = async () => {
  try {
    const response = await globalAxios.get(
      `api/admin/student/get-attendance-for-today`
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const createTodo = async (payload: any) => {
  try {
    const response = await globalAxios.post("api/remainder/ ", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating class:", error);
    throw error;
  }
};

export const getReminders = async (body: any) => {
  try {
    const response = await globalAxios.post(`api/remainder/get`, body);
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getClassTestById = async (id: any, examType: any) => {
  try {
    const response = await globalAxios.post(
      `api/teacher/get-class-tests/${id}`,
      examType
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const addTest = async (testId: any, payload: any) => {
  try {
    const response = await globalAxios.post(`api/marks/${testId} `, payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating class:", error);
    throw error;
  }
};

export const getClassDetailsById = async (id: any) => {
  try {
    const response = await globalAxios.get(
      `api/teacher/get-class-dashboard/${id}`
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getClassAttendanceById = async (id: any) => {
  try {
    const response = await globalAxios.get(
      `api/teacher/student/get-attendance-report/${id}`
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getStudentDetailsById = async (id: any) => {
  try {
    const response = await globalAxios.get(
      `api/teacher/student-dashboard-data/${id}`
    );
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getAdminDashboard = async () => {
  try {
    const response = await globalAxios.get(`api/admin/get-stats`);
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export {
  createClass,
  getAllClasses,
  getClassIds,
  addAttendance,
  createSubject,
  getAllSubjects,
};
