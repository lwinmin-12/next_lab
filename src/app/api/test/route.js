// import axios from "axios";
// import { NextResponse } from "next/server";
// import blobUtil from "blob-util";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// import { Client as FTPClient } from 'basic-ftp';

// export async function POST(request) {
//   const data = await request.formData();

//   // const fileObj = data.get("fileObj");
//   // console.log(fileObj.name);
//   // const accesskey = "wGFzTd9L26aTJt46tJTtzv5coNXgW5U3TLaIcHchEJIF"

//   // const buffer = Buffer.from(await fileObj.arrayBuffer());

//   // // const params = {
//   // //   Bucket: "mahar-new-develpment",
//   // //   Key: `${fileObj.name}_${Date.now()}`,
//   // //   Body: buffer,
//   // // };

//   // // const result = await s3.upload(params).promise();

//   // // console.log(result, "this is result");
//   // // try {
//   // //   const result = await s3.upload(params).promise();
//   // //   console.log(result);
//   // //   return NextResponse.ok("File uploaded successfully");
//   // // } catch (error) {
//   // //   console.error(error);
//   // //   return NextResponse.error("Failed to upload file to S3");
//   // // }

//   // const url = `https://maharbackup-nsu.akamaihd.net/1610410/test`;

//   // let fileStream = fileObj.stream();

//   // console.log(fileStream);

//   // try {
//   //   const response = await axios({
//   //     method: "put",
//   //     url: url,
//   //     data: fileStream,
//   //     headers: {
//   //       Authorization: `Bearer ${accesskey}`,
//   //       "Content-Type": "application/octet-stream", // You may need to change this based on file type
//   //       // "Content-Length": fileStream.length, // Optional, only if size is known
//   //     },
//   //     maxContentLength: Infinity,
//   //     maxBodyLength: Infinity,
//   //   });

//   //   console.log("Success:", response.data);
//   //   return NextResponse.ok("File uploaded successfully");
//   // } catch (error) {
//   //   console.error("Axios error:", error.response ? error.response.data : error.message);
//   //   return NextResponse.error("Failed to" )
//   // }

//   const client = new FTPClient();

//   try {
//     await client.access({
//       host: "maharbackup-nsu.akamaihd.net",
//       user: "maharstorageuser",
//       password: "d-45@Akamai",
//       secure: true, // If you need secure FTPS
//     });

//     const fileObj = data.get("fileObj");

//     const stream = Buffer.from(req.body.file, "binary");
//     await client.uploadFrom(stream, `/1112239/images/series/${fileObj.name}`);
//     client.close();
//     res.status(200).json({ message: "File uploaded successfully" });
//   } catch (error) {
//     console.error("FTP error:", error);
//     client.close();
//     res.status(500).json({ error: "Failed to upload the file" });
//   }
// }

import { Client as FTPClient } from "basic-ftp";

export async function POST(req) {
  const data = await req.formData();
  const client = new FTPClient();
  try {
    await client.access({
      host: "maharbackup-nsu.akamaihd.net",
      user: "maharstorageuser",
      password: "d-45@Akamai",
      secure: true,
    });
    const fileObj = data.get("fileObj");

    const stream = Buffer.from(req.body.file, "binary");
    await client.uploadFrom(stream, `/1112239/images/series/${fileObj.name}`);
    // Perform further operations or testing here

    client.close();
    res.status(200).json({ message: "Connection successful" });
  } catch (error) {
    console.error("FTP error:", error);
    client.close();
    // res.status(500).json({ error: "Failed to connect or authenticate" });
  }
}
