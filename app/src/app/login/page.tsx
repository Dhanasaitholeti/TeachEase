"use client";
import React, { useState } from "react";
import Teacher from "../../assets/teacher.avif";
import Image from "next/image";
import InputField from "../CommonComponents/InputField";
import { loginUser } from "@/service/login";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" })); // Clear individual field error
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (formData.password.length < 2)
      newErrors.password = "Password must be at least 2 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        passwd: formData.password,
      });

      if (response?.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userData", JSON.stringify(response.userData));
        localStorage.setItem("userMenu", JSON.stringify(response.userMenu));
        localStorage.setItem("redirectionUrl", response.redirectionUrl);

        toast.success("Login successful! Redirecting...");
        setTimeout(() => router.push(response.redirectionUrl), 1500);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBlue p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl flex overflow-hidden">
        <div className="hidden md:flex w-1/2 justify-center items-center bg-blue-100">
          <Image
            src={Teacher}
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Welcome !!
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Please log in to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email/Number"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <button
              type="submit"
              className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:opacity-90 transition flex items-center justify-center shadow-md"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
