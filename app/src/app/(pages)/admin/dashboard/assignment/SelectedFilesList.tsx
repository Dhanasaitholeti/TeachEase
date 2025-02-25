import React from "react";

interface SelectedFilesListProps {
  selectedFiles: File[];
  onRemoveFile: (fileName: string) => void;
}

const SelectedFilesList: React.FC<SelectedFilesListProps> = ({
  selectedFiles,
  onRemoveFile,
}) => {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4">
      {selectedFiles.map((file) => (
        <div key={file.name} className="relative flex flex-col ">
          <button
            onClick={() => onRemoveFile(file.name)}
            className="absolute top-[-13px] right-[-10px] w-7 h-7 text-white bg-primary rounded-full p-1 text-sm"
          >
            X
          </button>
          <img
            src={URL.createObjectURL(file)}
            alt={`Selected test paper ${file.name}`}
            className="w-32 h-auto rounded-lg shadow-lg border border-gray-300"
          />
          <p className="text-center text-gray-900 text-sm mt-2">
            {file.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SelectedFilesList;
