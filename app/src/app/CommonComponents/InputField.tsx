import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = "text", error, icon }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 flex items-center">
        {icon && <span className="mr-2">{icon}</span>} {label}
      </label>
      <div className="flex items-center border rounded-lg shadow-sm p-3 mt-1 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent focus:outline-none"
          placeholder={`Enter ${label}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
