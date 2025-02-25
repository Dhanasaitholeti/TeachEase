import { BaseName } from "../../services/s3.service";

export function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
    mp4: "video/mp4",
    mkv: "video/x-matroska",
  };

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

export const getRelativeUrl = (apiUrl: string) => {
  const index = apiUrl.indexOf(BaseName);
  if (index !== -1) {
    return apiUrl.substring(index);
  }
  return apiUrl;
};

export const getFileAndExtension = (
  fileName: string
): {
  filename: string;
  extension: string;
} => {
  const segments = fileName.split(".");
  const extension = segments[segments.length - 1];
  const filename = segments.slice(0, segments.length - 1).join(".");
  return { filename, extension };
};
