import React from "react";
import { createContext, useContext } from "react";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
// import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Task.css";
import sampleJson from "../data/sample.json";
import { Link } from "react-router-dom";

const IsProcessingContext = createContext(false);

const StartStopButton = (props: any): JSX.Element => {
  return (
    <IconButton
      onClick={
        props.status === "recording"
          ? props.stopRecording
          : props.startRecording
      }
      disabled={props.isProcessing}
    >
      {props.isProcessing ? (
        <MicIcon color="disabled" />
      ) : props.status === "recording" ? (
        <StopIcon color="error" />
      ) : (
        <MicIcon color="primary" />
      )}
    </IconButton>
  );
};

const RecordTableRow = (props: any) => {
  const isProcessing = useContext(IsProcessingContext);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  return (
    <tr>
      <td>{props.value}</td>
      <td>
        <StartStopButton
          isProcessing={isProcessing}
          status={status}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </td>
      <td>
        <audio src={mediaBlobUrl} controls />
      </td>
    </tr>
  );
};

const RecordTableRows = () => {
  const dialog = sampleJson[1]; // TODO: fetch from backend?

  const tableRows = dialog.conversation.map((uttjson) => (
    <RecordTableRow
      key={dialog.id + "_" + uttjson.no.toString()}
      value={uttjson.en_sentence}
    />
  ));

  return <>{tableRows}</>;
};

// TODO: move the components to another file
const RecordTable = () => {
  return (
    <Table>
      <thead>
        <tr>
          <td>Sentences to record</td>
          <td>Record / Stop</td>
          <td>Check the audio</td>
        </tr>
      </thead>
      <tbody>
        <RecordTableRows />
      </tbody>
    </Table>
  );
};

const Task = () => {
  const backendUrl = "http://localhost:8000/save-audio";

  // TODO: use json including audio
  const sampleJsonToBackend = {
    taskid: "task1",
    utterances: [
      {
        uttid: "uttid1",
        text: "text1",
      },
      {
        uttid: "uttid2",
        text: "text2",
      },
    ],
  };

  const handleSubmit = () => {
    fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sampleJsonToBackend),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <div className="Task">
      <h1>Audio Recording</h1>
      <p>Please read aloud the displayed sentences.</p>
      <RecordTable />
      <Link to="/finished">
        {" "}
        {/* TODO: redirect after ack from backend */}
        <Button type="submit" variant="outline-primary" onClick={handleSubmit}>
          {" "}
          {/* TODO: submit only if all mediaBlobUrl is set */}
          Submit all recordings
        </Button>
      </Link>
    </div>
  );
};

export default Task;
