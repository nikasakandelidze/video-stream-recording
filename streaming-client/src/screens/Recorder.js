import React from "react";
import axios from "axios";
import { useEffect, useState } from "react/cjs/react.development";

export default function Recorder() {
  const [recorder, setRecorder] = useState();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const videoRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });
        videoRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            sendBlobAsBase64(event.data);
          }
        };
        document.querySelector("video").srcObject = videoRecorder.stream;
        document.querySelector("video").play();
        setRecorder(videoRecorder);
      })
      .catch((e) => console.log(e));
  }, []);

  const startRecording = async () => {
    if (recorder) {
      recorder.start(1000);
    }
  };

  async function sendBlobAsBase64(blob) {
    //File reader is used to read blob data in javascript
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const dataUrl = reader.result;
      // in base64 encoding format third element with index 2 after splitting on ',' is the actual data
      const base64EncodedData = dataUrl.split(",")[2];
      sendDataToBackend(base64EncodedData);
    });
    reader.readAsDataURL(blob);
  }

  async function sendDataToBackend(base64EncodedData) {
    await axios.post("http://localhost:8081/api/upload", {
      data: base64EncodedData,
    });
  }

  return (
    <div>
      <video controls></video>
      <button id="start" onClick={() => startRecording()}>
        Start recording
      </button>
      <button onClick={() => recorder.stop()}>Stop recording</button>
    </div>
  );
}
