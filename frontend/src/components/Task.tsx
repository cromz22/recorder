import React from "react";
import { useState } from "react";
import "./Task.css";
import sampleJson from "../data/2utt.json";
import { useHistory, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RecordTable from "./RecordTable";
import { inputJsonType, inputUtteranceType, outputJsonType } from "./types";

const Task = () => {
  const backendUrl = "http://localhost:8000/save-audio";

  const inputJson: inputJsonType = sampleJson[0]; // TODO: fetch from backend?

  const utterances = inputJson.conversation.map(
    (inputUtterance: inputUtteranceType) => {
      return {
        uttid: inputUtterance.uttid,
        text: inputUtterance.en_sentence,
        audio: "",
        recorded: false,
      };
    }
  );

  const initialOutputJson: outputJsonType = {
    taskid: inputJson.task_id,
    utterances: utterances,
  };

  const [outputJson, setOutputJson] = useState(initialOutputJson);
  const { nutt, taskId } = useParams<{ nutt: string; taskId: string }>();

  let history = useHistory();

  const handleSubmit = () => {
    const isRecordedArray = outputJson.utterances.map(
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
      body: JSON.stringify(outputJson),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isAllRecorded) {
          history.push(`/finished/${nutt}/${taskId}`); // redirect
        }
        return console.log(data);
      });
  };

  return (
    <div className="Task">
      <h1>Audio Recording</h1>
      <p>Please read aloud the displayed sentences.</p>
      <RecordTable
        inputJson={inputJson}
        outputJson={outputJson}
        setOutputJson={setOutputJson}
      />
      {/* TODO: checkbox */}
      <Button type="submit" variant="outline-primary" onClick={handleSubmit}>
        Submit all recordings
      </Button>
    </div>
  );
};

export default Task;
