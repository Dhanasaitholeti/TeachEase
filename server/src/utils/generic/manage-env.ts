import dotenv from "dotenv";
dotenv.config();

interface IEnvVariables {
  PORT: string;
  RATE_LIMIT: string;
  AWS_S3_ACCESS_KEY_ID: string;
  AWS_S3_SECRET_ACCESS_KEY: string;
  AWS_S3_REGION: string;
  AWS_BUCKET_NAME: string;
  AWS_PREVIEW_BASE_PATH: string;
  JWT_SECRET: string;
  ADMIN_PASSWORD: string;
  WEB_APP_URL: string;
  OPENAI_API_KEY: string;
}

const EnvVariables: IEnvVariables = {
  PORT: process.env.PORT || "8080",
  RATE_LIMIT: process.env.RATE_LIMIT || "9999",
  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID || "",
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY_ID || "",
  AWS_S3_REGION: process.env.AWS_S3_REGION || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
  AWS_PREVIEW_BASE_PATH: process.env.AWS_PREVIEW_BASE_PATH || "",
  JWT_SECRET: process.env.JWT_SECRET || "heeheesecretitiswhatitis",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "test",
  WEB_APP_URL: process.env.WEB_APP_URL || "http://localhost:3000",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
};

export const getEnv = (key: keyof IEnvVariables) => {
  return EnvVariables[key];
};
