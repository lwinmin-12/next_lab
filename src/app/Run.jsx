"use client";
import React, { useState } from "react";
import { Button, Image, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import axios from "axios";
import { getImageSize } from "react-image-size";

function Run() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [uploadObj, setUploadObj] = useState();

  let imgRatioObj = {
    one: {
      mobileWidth: "350",
      mobileHeight: "140",

      tvWidth: "1170",
      tvHeight: "180",
    },
    two: {
      mobileWidth: "172",
      mobileHeight: "140",

      tvWidth: "580",
      tvHeight: "180",
    },
    three: {
      mobileWidth: "100",
      mobileHeight: "140",

      tvWidth: "384",
      tvHeight: "180",
    },
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setUploadObj(info.file.originFileObj);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  async function handleUpload() {
    const data = new FormData();
    data.append("fileObj", uploadObj);

    axios.post("/api/test", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }

    let isAcceptRatio = getBase64(file, async (url) => {
      const dimensions = await getImageSize(url);

      // if()
      // const devisor = gcd(dimensions.width, dimensions.height);
      // const aspectRatio =
      //   dimensions.width / devisor + ":" + dimensions.height / devisor;


      if (
        imgRatioObj.one.mobileWidth == dimensions.width ||
        imgRatioObj.one.mobileWidth == dimensions.width
      ) {
      }
      // console.log(devisor, "result of gcd");
      // console.log(aspectRatio, "aspectRatio");
      // console.log(dimensions.width / dimensions.height, "devi result");
    });

    return isJpgOrPng && isLt2M;
  };

  console.log(Date.now());

  return (
    <div>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action=""
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>

      <Button onClick={() => handleUpload()}>Upload</Button>
    </div>
  );
}
export default Run;
