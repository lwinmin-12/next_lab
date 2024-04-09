import axios from "axios";
import { NextResponse } from "next/server";
import blobUtil from "blob-util";

import AWS from "aws-sdk";
import { S3 } from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: "",
  secretAccessKey: "",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const data = await request.formData()

  const fileObj = data.get("fileObj");
  const buffer = Buffer.from(await fileObj.arrayBuffer());

  const params = {
    Bucket: "",
    Key: `${Math.random()}-${fileObj.name}`,
    Body: buffer,
  };

  const result = await s3.upload(params).promise();

  console.log(result, "this is result");
  try {
    const result = await s3.upload(params).promise();
    console.log(result);
    return NextResponse.ok("File uploaded successfully");
  } catch (error) {
    console.error(error);
    return NextResponse.error("Failed to upload file to S3");
  }
}
