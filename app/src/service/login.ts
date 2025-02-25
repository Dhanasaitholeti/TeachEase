import globalAxios from "@/lib/globalAxios/globalAxios";

interface LoginCredentials {
  email: string;
  passwd: string;
}

const loginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await globalAxios.post("/api/auth/login", credentials);

    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

export { loginUser };
