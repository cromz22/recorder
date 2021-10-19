import React from "react";
import { createContext, useContext } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
// import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import sampleJson from "./data/sample.json";

const IsProcessingContext = createContext(false);

const StartStopButton = (): JSX.Element => {
  const isProcessing = useContext(IsProcessingContext);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  return (
    <IconButton
      onClick={status === "recording" ? stopRecording : startRecording}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <MicIcon color="disabled" />
      ) : status === "recording" ? (
        <StopIcon color="error" />
      ) : (
        <MicIcon color="primary" />
      )}
    </IconButton>
  );
};

const RecordTableRow = (props: any) => {
  return (
    <tr>
      <td className="align-middle">{props.value}</td>
      <td className="align-middle">
        <StartStopButton />
      </td>
    </tr>
  );
};

const RecordTableRows = () => {
  const dialog = sampleJson[0];

  const tableRows = dialog.conversation.map((uttjson) => (
    <RecordTableRow
      key={dialog.id + "_" + uttjson.no.toString()}
      value={uttjson.en_sentence}
    />
  ));

  return <>{tableRows}</>;
};

const RecordTable = () => {
  return (
    <Table>
      <thead>
        <tr>
          <td>Sentences to record</td>
          <td>Record/Stop</td>
        </tr>
      </thead>

      <tbody>
        <RecordTableRows />
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
};

const App = () => {
  console.log(sampleJson[0]);
  return <AudioForm />;
};

export default App;
