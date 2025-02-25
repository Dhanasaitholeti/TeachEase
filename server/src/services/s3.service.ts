import AWS from "aws-sdk";
import {
  getFileAndExtension,
  getMimeType,
  getRelativeUrl,
} from "../utils/s3/fileUploader.util";
import { v4 as uuidv4 } from "uuid";
import { getEnv } from "../utils/generic/manage-env";

export const BaseName = "teachease";

const s3 = new AWS.S3({
  accessKeyId: getEnv("AWS_S3_ACCESS_KEY_ID"),
  secretAccessKey: getEnv("AWS_S3_SECRET_ACCESS_KEY"),
  signatureVersion: "v4",
  region: getEnv("AWS_S3_REGION"),
});

export const getPreSignedUrl = async (fileName: string) => {
  const basePath = BaseName + "/" + uuidv4() + "/";
  const filePath = basePath + fileName;

  console.log(`**************************************`);
  console.log(getEnv("AWS_PREVIEW_BASE_PATH"));
  console.log(`**************************************`);

  const params = {
    Bucket: getEnv("AWS_BUCKET_NAME"),
    Key: `${filePath}`,
    ACL: "public-read",
    Expires: 60 * 60,
    ContentType: getMimeType(getFileAndExtension(fileName).extension),
  };

  console.log(`**************************************`);
  console.log(params, "params");
  console.log(`**************************************`);

  try {
    const presignedPUTURL = await s3.getSignedUrl("putObject", params);

    console.log(`**************************************`);
    console.log(presignedPUTURL, "hee hee");
    console.log(`**************************************`);

    return presignedPUTURL;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const uploadFileViaS3 = async (fileContent: any, outputKey: string) => {
  const config = {
    Bucket: getEnv("AWS_BUCKET_NAME"),
    Key: outputKey,
    Body: fileContent,
    ACL: "public-read",
    ContentType: getMimeType(getFileAndExtension(outputKey).extension),
  };
  try {
    const result = await s3.upload(config).promise();
    return getRelativeUrl(result.Location);
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const getS3Object = async (inputKey: string) => {
  try {
    const key = `${getEnv("AWS_PREVIEW_BASE_PATH")}${inputKey}`;
    const s3 = new AWS.S3({ region: getEnv("AWS_S3_REGION") });

    const s3Object = await s3
      .getObject({
        Bucket: getEnv("AWS_BUCKET_NAME"),
        Key: key,
      })
      .promise();

    return s3Object;
  } catch (error) {
    console.log("unable to get the object from the s3");
    return null;
  }
};
