import React from "react";
import { createContext, useContext } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import tmpJson from "./data/tmp.json"


const IsProcessingContext = createContext(false);

const StartStopButton = (): JSX.Element => {
  const isProcessing = useContext(IsProcessingContext);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

	return (
    <IconButton
      onClick={status == "recording" ? stopRecording : startRecording}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <MicIcon color="disabled" />
      ) : status == "recording" ? (
        <StopIcon color="error" />
      ) : (
        <MicIcon color="primary" />
      )}
    </IconButton>
  );
};

const RecordTable = () => {
  const utts = [
    "This is utterance 1.",
    "This is utterance 2.",
    "This is utterance 3.",
    "This is utterance 4.",
    "This is utterance 5.",
    "This is utterance 6.",
    "This is utterance 7.",
  ];

  return (
    <Table>
      <thead>
        <tr>
          <td>Sentences to record</td>
          <td>Record/Stop</td>
        </tr>
      </thead>

      <tbody>
        {utts.map((utt) => (
          <tr key="{utt}">
            <td className="align-middle">{utt}</td>
            <td className="align-middle">
              <StartStopButton />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const AudioForm = () => {
  return (
    <>
      <h1>Audio Recording</h1>
      <p>Please read aloud the displayed sentences.</p>
      <RecordTable />
    </>
  );
}

const App = () => {
  // console.log(tmpJson);
  return <AudioForm />;
}

export default App;
