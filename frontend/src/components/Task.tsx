import React from "react";
import { useState } from "react";
import "./Task.css";
// import sampleJson from "../data/sample.json";
import sampleJson from "../data/2utt.json";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RecordTable from "./RecordTable";


const Task = () => {
  const backendUrl = "http://localhost:8000/save-audio";

  const dialog = sampleJson[0]; // TODO: fetch from backend?

  interface utterance {
    uttid: string;
    text: string;
    audio: string;
    recorded: boolean;
  }

  interface allBlobsType {
    taskid: string;
    utterances: utterance[];
  }

  const utterances = dialog.conversation.map((uttjson: any) => {
    return {
      uttid: uttjson.uttid,
      text: uttjson.en_sentence,
      audio: "",
      recorded: false,
    };
  });

  const initialAllBlobs: allBlobsType = {
    taskid: dialog.task_id,
    utterances: utterances,
  };

  const [allBlobs, setAllBlobs] = useState(initialAllBlobs);

  let history = useHistory();

  const handleSubmit = () => {
    const isRecordedArray = allBlobs.utterances.map(
      (utterance) => utterance.recorded
    );
    const isAllRecorded = isRecordedArray.every(
      (isRecorded) => isRecorded === true
    );
    if (!isAllRecorded) {
      alert("Please record all the utterances before you submit.");
    }

    fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(allBlobs),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isAllRecorded) {
          history.push("/finished"); // redirect
        }
        return console.log(data);
      });
  };

  return (
    <div className="Task">
      <h1>Audio Recording</h1>
      <p>Please read aloud the displayed sentences.</p>
      <RecordTable
        dialog={dialog}
        allBlobs={allBlobs}
        setAllBlobs={setAllBlobs}
      />
      {/* TODO: checkbox */}
      <Button type="submit" variant="outline-primary" onClick={handleSubmit}>
        Submit all recordings
      </Button>
    </div>
  );
};

export default Task;
